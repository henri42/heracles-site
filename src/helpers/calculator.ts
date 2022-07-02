import BN from "bn.js"
import { gql, request } from "graphql-request"
import { isValidAddress, query } from "ternoa-js/blockchain"

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

export const getRewardsData = async (address: string): Promise<IRewardsData> => {
  if (!isValidAddress(address))
    throw new Error("Invalid Ternoa address", {
      cause: new Error("Invalid address"),
    })

  const { events }: IEventsResponse = await apiDictionary(queryRewardedEvents(address))

  const { nodes, totalCount } = events
  if (totalCount === 0) return { firstTimestamp: "no date", total: new BN(0) }

  const firstTimestamp = nodes[0].block.timestamp
  let counter = new BN(0)
  nodes.forEach(({ argsValue }) => (counter = counter.add(new BN(argsValue[1]))))

  return {
    firstTimestamp,
    total: counter,
  }
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
