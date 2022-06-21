import { useState } from "react";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
dayjs.extend(localizedFormat);

import CalculatorIcon from "../../assets/calculator.svg";
import Header from "../../components/Header/Header";
import {
  CURRENT_ACTIVE_VALIDATORS_ADDRESSES,
  HERACLES_NODE_ADDRESS,
} from "../../constants";
import {
  getRewardsData,
  isNominatingValidator,
} from "../../helpers/calculator";

import classes from "./Calculator.module.scss";

export const formatPrice = (
  n: number,
  options: Intl.NumberFormatOptions = {
    style: "currency",
    currency: "USD",
  }
) => {
  const formatter = new Intl.NumberFormat("en-US", options);

  return formatter.format(n);
};

const Calculator = () => {
  const [address, setAddress] = useState<string | undefined>(undefined);
  const [error, setError] = useState<React.ReactNode | string>("");
  const [isHeraclesAddress, setIsHeraclesAddress] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isNominating, setIsNominating] = useState<boolean>(false);
  const [rewardsData, setRewardsData] = useState<
    { eraApr?: string; firstTimestamp: string; total: string } | undefined
  >(undefined);

  const onClick = async () => {
    if (address !== undefined) {
      setError("");
      setIsHeraclesAddress(false);
      setIsLoading(true);
      setIsNominating(false);
      try {
        const res = await getRewardsData(address);
        if (address === HERACLES_NODE_ADDRESS) setIsHeraclesAddress(true);
        else if (CURRENT_ACTIVE_VALIDATORS_ADDRESSES.includes(address))
          setIsNominating(false);
        else {
          const isNominatingHeracles = await isNominatingValidator(
            address,
            HERACLES_NODE_ADDRESS
          );
          setIsNominating(isNominatingHeracles);
        }
        setRewardsData(res);
      } catch (error) {
        if (
          error instanceof Error &&
          error.cause?.message === "Invalid address"
        ) {
          setError("Wait, this is not a valid Ternoa address 😡");
        } else if (
          error instanceof Error &&
          error.cause?.message === "Invalid nominator address"
        ) {
          setError(
            <p>
              You are not an active nominator
              <br />
              Stake your CAPS on HERACLES and earn daily rewards 🏺
            </p>
          );
        } else {
          setError("Unable to calculate your rewards... 🧿");
          console.log(error);
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      <Header
        pageNameXs="Calculator"
        pageName="Ternoa Staking Rewards Calculator"
        icon={CalculatorIcon}
        navLinks={[
          {
            label: "Heracles ▸",
            title: "Heracles homepage",
            uri: "https://heracles.works",
          },
        ]}
      />
      <div className={classes.container}>
        <main className={classes.root}>
          <h2>Calculate your staking rewards on Ternoa mainnet</h2>
          <div className={classes.input}>
            <input
              className={classes.input}
              onChange={(e) => setAddress(e.target.value)}
              onKeyUp={(e) => {
                if (e.key === "Enter" || e.code === "13") {
                  onClick();
                }
              }}
              placeholder="Enter your address"
              type="text"
            />
            {error !== "" && <div className={classes.error}>{error}</div>}
          </div>
          <button
            className={classes.button}
            disabled={isLoading}
            onClick={onClick}
          >
            {isLoading
              ? "Loading..."
              : error !== ""
              ? "Try again"
              : "Tell me !"}
          </button>
          {!isLoading && rewardsData !== undefined && error === "" && (
            <section className={classes.rewardsBox}>
              <div>
                {Number(rewardsData.total) > 0 ? (
                  <>
                    <p>You have earned</p>
                    <p className={classes.rewards}>
                      🏺 {formatPrice(Number(rewardsData.total), {})} CAPS
                    </p>
                  </>
                ) : (
                  <p>
                    Your nomination will be active in 2 eras; try again
                    tomorrow.
                  </p>
                )}
                {rewardsData.firstTimestamp !== "no date" && (
                  <p>since {dayjs(rewardsData.firstTimestamp).format("ll")}</p>
                )}
                {rewardsData.eraApr && (
                  <p>
                    Your estimated current APR:{" "}
                    <span
                      className={classes.apr}
                    >{`~${rewardsData.eraApr}%`}</span>
                  </p>
                )}
                <p className={classes.thanks}>
                  {isHeraclesAddress
                    ? "Welcome HERACLES 👑"
                    : isNominating
                    ? "Heracles thanks you for your nomination and support 🌟"
                    : "If you like this calculator, support HERACLES as a nominator 💪"}
                </p>
              </div>
            </section>
          )}
        </main>
      </div>
    </>
  );
};

export default Calculator;
