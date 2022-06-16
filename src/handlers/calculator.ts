import BN from "bn.js";
import { gql, request } from "graphql-request";
import { isValidAddress } from "ternoa-js/blockchain";

export interface IEvent {
  argsValue: string[];
  block: {
    timestamp: string;
  };
}

export interface IEventsResponse {
  events: {
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
  if (!isValidAddress(address)) throw new Error('Invalid Ternoa address', {
    cause: new Error('Invalid address'),
  });

  const { events }: IEventsResponse = await apiDictionary(
    queryRewardedEvents(address)
  );

  const { nodes } = events;
  if (nodes.length === 0) return { firstTimestamp: "no date", total: "0" };

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
