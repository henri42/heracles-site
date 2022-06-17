import BN from "bn.js";
import { gql, request } from "graphql-request";
import { initializeApi, isValidAddress, query } from "ternoa-js/blockchain";

export interface IEvent {
  argsValue: string[];
  block: {
    timestamp: string;
  };
}

export interface IEventsResponse {
  events: {
    totalCount: number
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
): Promise<{ firstTimestamp: string; total: string }> => {
  if (!isValidAddress(address))
    throw new Error("Invalid Ternoa address", {
      cause: new Error("Invalid address"),
    });

  const { events }: IEventsResponse = await apiDictionary(
    queryRewardedEvents(address)
  );

  const { nodes, totalCount } = events;
  if (totalCount === 0) return { firstTimestamp: "no date", total: "0" };

  const firstTimestamp = nodes[0].block.timestamp;
  let counter = new BN(0);
  nodes.forEach(
    ({ argsValue }) => (counter = counter.add(new BN(argsValue[1])))
  );

  return {
    firstTimestamp,
    total: formatBalance(counter.toString()),
  };
};

export const isNominatingValidator = async (address: string, validatorAddress: string): Promise<boolean> => {
  await initializeApi("wss://mainnet.ternoa.network");
  const res = await query("staking", "nominators", [address]);
  if (res.toJSON() === null) throw new Error("Invalid nominator address", {
    cause: new Error("Invalid nominator address"),
  });
  const { targets } = res.toJSON() as { submittedIn: number, targets: string[] };
  return targets.includes(validatorAddress);
};
