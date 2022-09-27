import BN from "bn.js"
import { gql, request } from "graphql-request"
import { balanceToNumber, isValidAddress, query } from "ternoa-js/blockchain"
import dayjs from "dayjs"
import localizedFormat from "dayjs/plugin/localizedFormat"
dayjs.extend(localizedFormat)

import { IEventsResponse } from "../types/dictionary"
import { EraValidatorStakersType, IRewardsData, NominatorTargetsType } from "../types/pallets"

export const apiDictionary = (query: string) => request("https://dictionary-mainnet.ternoa.dev/", query)

export const queryRewardedEvents = (address: string) => gql`
  {
  events(
    orderBy: [BLOCK_HEIGHT_ASC]
    filter: {
      and: [
        { call: { equalTo: "Rewarded" } }
        {
          argsValue: {
            contains: "${address}"
          }
        }
      ]
    }
  ) {
    totalCount
    nodes {
      argsValue
      block {
        timestamp
      }
    }
  }
}
`

const formatTimestamp = (timestamp: string): string => {
  const [, time] = timestamp.split("T")
  const hour = time.substring(0, 2)
  if (Number(hour) < 13) {
    return dayjs(timestamp).subtract(1, "day").format("ll")
  }
  return dayjs(timestamp).format("ll")
}

const compoundSameDateRewards = async (data: IRewardsData): Promise<IRewardsData> => {
  const compoundData = data.reduce(async (a: any, current) => {
    const prev = await a
    const isSameDate = prev.length > 0 && prev[prev.length - 1].formattedTimestamp === current.formattedTimestamp
    if (isSameDate) {
      const rewards = prev[prev.length - 1].rewards.add(current.rewards)
      const formattedRewards = balanceToNumber(rewards)
      return [...prev.slice(0, prev.length - 1), { ...current, formattedRewards, rewards }]
    }
    return [...prev, current]
  }, [])

  return compoundData
}

export const getRewardsData = async (address: string): Promise<IRewardsData> => {
  if (!isValidAddress(address))
    throw new Error("Invalid Ternoa address", {
      cause: new Error("Invalid address"),
    })

  const { events }: IEventsResponse = await apiDictionary(queryRewardedEvents(address))
  const { nodes, totalCount } = events
  if (totalCount === 0) return []

  let totalBN = new BN(0)
  const totals: BN[] = []
  nodes.forEach(({ argsValue }) => {
    totalBN = totalBN.add(new BN(argsValue[1]))
    totals.push(totalBN)
  })

  const data = await Promise.all(
    nodes.map(async ({ argsValue, block }, idx) => {
      const { timestamp }: { timestamp: string } = block
      const rewards: BN = new BN(argsValue[1])
      const formattedTimestamp = idx === 0 ? dayjs(timestamp).format("LL") : formatTimestamp(timestamp).split(",")[0]
      const formattedRewards = balanceToNumber(rewards)
      const formattedTotal = balanceToNumber(totalBN)
      const numberedTotal = Number(
        balanceToNumber(totals[idx], { forceUnit: "-", withUnit: false }).split(",").join(""),
      )
      return { formattedRewards, formattedTimestamp, formattedTotal, numberedTotal, rewards, timestamp }
    }),
  )
  return compoundSameDateRewards(data)
}

export const getEraActiveValiadtors = async (era: number): Promise<string[]> => {
  const res = await query("staking", "erasRewardPoints", [era])
  const { individual } = res.toJSON() as {
    individual: object
  }
  return Object.keys(individual)
}

export const isNominatingValidator = async (address: string, validatorAddress: string): Promise<boolean> => {
  const res = await query("staking", "nominators", [address])
  if (res.toJSON() === null)
    throw new Error("Invalid nominator address", {
      cause: new Error("Invalid nominator address"),
    })
  const { targets } = res.toJSON() as {
    submittedIn: number
    targets: string[]
  }
  return targets.includes(validatorAddress)
}

const getAPR = (balanceBond: BN, totalDailyRewards: BN, totalStake: BN) =>
  balanceBond.mul(totalDailyRewards).mul(new BN(365)).div(totalStake).mul(new BN(100)).div(balanceBond).toString()

const getStakerTargets = async (address: string): Promise<string[]> => {
  const res = await query("staking", "nominators", [address])
  if (res.toJSON() === null)
    throw new Error("Invalid nominator address", {
      cause: new Error("Invalid nominator address"),
    })
  const { targets } = res.toJSON() as NominatorTargetsType
  return targets
}

const getStakerTargetEraAPR = async (
  nominatorAddress: string,
  validatorAddress: string,
  era: number,
): Promise<number> => {
  const res = await query("staking", "erasStakers", [era, validatorAddress])
  const { others, total } = res.toJSON() as unknown as EraValidatorStakersType
  const staker = others.find(({ who }) => who === nominatorAddress)
  if (staker === undefined) return 0
  const apr = getAPR(
    new BN(staker.value.substring(2), "hex"),
    new BN("6133000000000000000000"), // average daily reward value per validator: 6133 CAPS
    new BN(total.substring(2), "hex"),
  )
  return Number(apr)
}

export const getStakerEraAPR = async (nominatorAddress: string, era: number): Promise<number> => {
  const targets = await getStakerTargets(nominatorAddress)
  const APRs = (await Promise.all(targets.map(async (x) => getStakerTargetEraAPR(nominatorAddress, x, era)))).filter(
    (apr) => apr !== 0,
  )
  return APRs.reduce((a, b) => a + b, 0) / APRs.length
}

export const getValidatorEraAPR = async (validatorAddress: string, era: number): Promise<number> => {
  const res = await query("staking", "erasStakers", [era, validatorAddress])
  const { own, total } = res.toJSON() as unknown as EraValidatorStakersType
  const apr = getAPR(
    new BN(own.substring(2), "hex"),
    new BN("6133000000000000000000"), // average daily reward value per validator: 6133 CAPS
    new BN(total.substring(2), "hex"),
  )
  return Number(apr)
}
