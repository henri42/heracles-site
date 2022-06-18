import { useState } from "react";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
dayjs.extend(localizedFormat);

import TernoaLogo from "../../assets/ternoa.svg";
import { HERACLES_NODE_ADDRESS } from "../../constants";
import {
  getRewardsData,
  isNominatingValidator,
} from "../../handlers/calculator";

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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isNominating, setIsNominating] = useState<boolean>(false);
  const [rewardsData, setRewardsData] = useState<
    { firstTimestamp: string; total: string } | undefined
  >(undefined);

  const onClick = async () => {
    if (address !== undefined) {
      setError("");
      setIsLoading(true);
      try {
        const res = await getRewardsData(address);
        const isNominatingHeracles = await isNominatingValidator(
          address,
          HERACLES_NODE_ADDRESS
        );
        setRewardsData(res);
        setIsNominating(isNominatingHeracles);
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
              Your are not an active nominator
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
    <main className={classes.root}>
      <h2>
        Calculate your staking rewards on <img src={TernoaLogo} alt="Ternoa Logo" /> mainnet
      </h2>
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
      <button className={classes.button} disabled={isLoading} onClick={onClick}>
        {isLoading ? "Loading..." : error !== "" ? "Try again" : "Tell me !"}
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
                Your nomination will be active in 2 eras; try again tomorrow.
              </p>
            )}
            {rewardsData.firstTimestamp !== "no date" && (
              <p>since {dayjs(rewardsData.firstTimestamp).format("ll")}</p>
            )}
            <p className={classes.thanks}>
              {isNominating
                ? "Heracles thanks you for your nomination and support 🌟"
                : "If you like this calculator, support HERACLES as a nominator 💪"}
            </p>
          </div>
        </section>
      )}
    </main>
  );
};

export default Calculator;
