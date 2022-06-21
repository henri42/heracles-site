import BN from "bn.js";
import { gql, request } from "graphql-request";
import { getBalances } from "ternoa-js";
import { isValidAddress, query } from "ternoa-js/blockchain";

import { CURRENT_ACTIVE_VALIDATORS_ADDRESSES } from "../constants";

export interface IEvent {
  argsValue: string[];
  block: {
    timestamp: string;
  };
}

export interface IEventsResponse {
  events: {
    totalCount: number;
    nodes: IEvent[];
  };
}

const NUMBER_OF_DECIMALS = 18;

export const formatBalance = (balance: string, decimals = 3) => {
  return String(
    Number(balance.slice(0, -(NUMBER_OF_DECIMALS - decimals))) /
      Math.pow(10, decimals)
  );
};

export const apiDictionary = (query: string) =>
  request("https://dictionary-mainnet.ternoa.dev/", query);

export const queryRewardedEvents = (address: string) => gql`
  {
  events(
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
`;

export const getRewardsData = async (
  address: string
): Promise<{ eraApr?: string, firstTimestamp: string; total: string }> => {
  if (!isValidAddress(address))
    throw new Error("Invalid Ternoa address", {
      cause: new Error("Invalid address"),
    });

  const { events }: IEventsResponse = await apiDictionary(
    queryRewardedEvents(address)
  );

  const { nodes, totalCount } = events;
  if (totalCount === 0) return { eraApr: undefined, firstTimestamp: "no date", total: "0" };

  const firstTimestamp = nodes[0].block.timestamp;
  let counter = new BN(0);
  nodes.forEach(
    ({ argsValue }) => (counter = counter.add(new BN(argsValue[1])))
  );
  const eraApr = await getEraAddressAPR(address, CURRENT_ACTIVE_VALIDATORS_ADDRESSES)

  return {
    eraApr,
    firstTimestamp,
    total: formatBalance(counter.toString()),
  };
};

export const isNominatingValidator = async (
  address: string,
  validatorAddress: string
): Promise<boolean> => {
  const res = await query("staking", "nominators", [address]);
  if (res.toJSON() === null)
    throw new Error("Invalid nominator address", {
      cause: new Error("Invalid nominator address"),
    });
  const { targets } = res.toJSON() as {
    submittedIn: number;
    targets: string[];
  };
  return targets.includes(validatorAddress);
};

const getAPR = (balanceBond: BN, totalDailyRewards: BN, totalStake: BN) =>
  balanceBond
    .mul(totalDailyRewards)
    .mul(new BN(365))
    .div(totalStake)
    .mul(new BN(100))
    .div(balanceBond)
    .toString();

export const getEraAddressAPR = async (
  address: string,
  activeValidators: string[]
) => {
  const currentEra = (await query("staking", "currentEra")).toString();
  const isNominatingActiveValidator = activeValidators.some(
    (validatorAddress) => isNominatingValidator(address, validatorAddress)
  );
  if (!isNominatingActiveValidator)
    throw new Error(
      `Address ${address} is not nominating any active validator during the current era ${currentEra}`
    );
  const { miscFrozen } = await getBalances(address);
  const eraTotalStake = new BN(
    (await query("staking", "erasTotalStake", [currentEra])).toString()
  );
  const res = await query("stakingRewards", "data");
  const { sessionExtraRewardPayout } = res.toJSON() as {
    sessionEraPayout: string;
    sessionExtraRewardPayout: string;
  };
  const eraTotalRewards = new BN(sessionExtraRewardPayout.substring(2), 'hex');
  return getAPR(miscFrozen, eraTotalRewards, eraTotalStake);
};
