import { useState } from "react";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
dayjs.extend(localizedFormat);

import TernoaLogo from "../../assets/ternoa.svg";
import { getRewardsData } from "../../handlers/calculator";

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
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rewardsData, setRewardsData] = useState<
    { firstTimestamp: string; total: string } | undefined
  >(undefined);

  const onClick = async () => {
    if (address !== undefined) {
      setError("");
      setIsLoading(true);
      try {
        const res = await getRewardsData(address);
        setRewardsData(res);
      } catch (error) {
        if (
          error instanceof Error &&
          error.cause?.message === "Invalid address"
        ) {
          setError("Wait, this is not a valid Ternoa address 😡");
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
        Calculate your staking rewards <br />
        on <img src={TernoaLogo} alt="Ternoa Logo" /> mainnet
      </h2>
      <div className={classes.input}>
        <label htmlFor="">Enter your nominator account address</label>
        <input
          onChange={(e) => setAddress(e.target.value)}
          onKeyUp={(e) => {
            if (e.key === "Enter" || e.code === "13") {
              onClick();
            }
          }}
          type="text"
        />
        {error !== "" && <div className={classes.error}>{error}</div>}
      </div>
      <button className={classes.button} disabled={isLoading} onClick={onClick}>
        {isLoading ? "Loading..." : "Tell me !"}
      </button>
      <section className={classes.rewardsBox}>
        {rewardsData !== undefined && error === "" && (
          <div>
            <p>You have earned</p>
            <div className={classes.rewards}>
              🏺 {formatPrice(Number(rewardsData.total), {})} CAPS
            </div>
            <p>since {dayjs(rewardsData.firstTimestamp).format("ll")}</p>
          </div>
        )}
      </section>
    </main>
  );
};

export default Calculator;
