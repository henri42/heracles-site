import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
import { AnyAction } from "redux";
import { getBalances } from "ternoa-js";

import { actions } from "../redux/user/actions";
import { clear, get, USER_POLKADOT_ADDRESS } from "./storage";

const NUMBER_OF_DECIMALS = 18;

const formatBalance = (balance: string, decimals = 3) => {
  return (
    Number(balance.slice(0, -(NUMBER_OF_DECIMALS - decimals))) /
    Math.pow(10, decimals)
  );
};

const availableBalance = async (address: string) => {
  const { free, miscFrozen } = await getBalances(address);
  const balance = free.sub(miscFrozen)
  return formatBalance(balance.toString())
};

export const reconnect = async (dispatch: (action: AnyAction) => void) => {
  try {
    const polkadotAddress = get(USER_POLKADOT_ADDRESS);
    if (polkadotAddress) {
      const accounts = await getAccounts();
      const account = accounts.find((x) => x.address === polkadotAddress);
      if (!account) throw new Error("Account not found in extenstion");
      connect(account, dispatch);
    }
  } catch (err) {
    console.error(err);
    clear(USER_POLKADOT_ADDRESS);
  }
};

export const getAccounts = async () => {
  const { web3Accounts, web3Enable } = await import("@polkadot/extension-dapp");
  const extensions = await web3Enable("ternoa-bridge");
  if (extensions.length === 0)
    throw new Error(
      'polkadot{.js} extension is not installed.\n\nOtherwise make sure you allowed Ternoa Bridge application in the "Manage Website Access" settings of your wallet.'
    );
  const allAccounts = await web3Accounts();
  return allAccounts;
};

export const connect = async (
  account: InjectedAccountWithMeta,
  dispatch: (action: AnyAction) => void
) => {
  const { web3FromSource } = await import("@polkadot/extension-dapp");
  const injector = await web3FromSource(account.meta.source);
  const data = {
    address: account.address,
    injector,
    capsBalance: await availableBalance(account.address),
  };
  dispatch(actions.login(data));
};
