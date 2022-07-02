import { useState } from "react"
import dayjs from "dayjs"
import localizedFormat from "dayjs/plugin/localizedFormat"
dayjs.extend(localizedFormat)

import CalculatorIcon from "../../assets/calculator.svg"
import Header from "../../components/Header/Header"
import { HERACLES_NODE_ADDRESS } from "../../constants"
import { getRewardsData, getStakerEraAPR, isNominatingValidator } from "../../helpers/calculator"

import classes from "./Calculator.module.scss"
import { formatBalance, query } from "ternoa-js"

const Calculator = () => {
  const [address, setAddress] = useState<string | undefined>(undefined)
  const [error, setError] = useState<React.ReactNode | string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [apr, setApr] = useState<number | undefined>(undefined)
  const [firstTimestamp, setFirstTimestamp] = useState<string | undefined>(undefined)
  const [formattedTotal, setFormattedTotal] = useState<string | undefined>(undefined)
  const [thanksMessage, setThanksMessage] = useState("If you like this calculator, support HERACLES as a nominator 💪")

  const reset = () => {
    setError("")
    setIsLoading(true)
  }

  const getThanksMessage = async (address: string) => {
    if (address === HERACLES_NODE_ADDRESS) setThanksMessage("Welcome HERACLES 👑")
    else {
      const isNominatingHeracles = await isNominatingValidator(address, HERACLES_NODE_ADDRESS)
      if (isNominatingHeracles) setThanksMessage("Heracles thanks you for your nomination and support 🌟")
      else setThanksMessage("If you like this calculator, support HERACLES as a nominator 💪")
    }
  }

  const onClick = async () => {
    if (address !== undefined) {
      reset()
      try {
        const currentEra = Number((await query("staking", "currentEra")).toString())
        const apr = await getStakerEraAPR(address, currentEra)
        const { firstTimestamp, total } = await getRewardsData(address)
        const formattedTotalRewards = await formatBalance(total)
        getThanksMessage(address)
        setApr(apr)
        setFirstTimestamp(firstTimestamp)
        setFormattedTotal(formattedTotalRewards)
      } catch (error) {
        if (error instanceof Error && error.cause?.message === "Invalid address") {
          setError("Wait, this is not a valid Ternoa address 😡")
        } else if (error instanceof Error && error.cause?.message === "Invalid nominator address") {
          setError(
            <p>
              You are not an active nominator
              <br />
              Stake your CAPS on HERACLES and earn daily rewards 🏺
            </p>,
          )
        } else {
          setError("Unable to calculate your rewards... 🧿")
          console.log(error)
        }
      } finally {
        setIsLoading(false)
      }
    }
  }

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
                  onClick()
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
          {!isLoading && error === "" && (
            <section className={classes.rewardsBox}>
              {formattedTotal === "0" ? (
                <p>Your nomination will be active in 1 era; try again tomorrow.</p>
              ) : formattedTotal !== undefined ? (
                <>
                  <p>You have earned</p>
                  <p className={classes.rewards}>{`🏺 ${formattedTotal}`}</p>
                  <p>since {dayjs(firstTimestamp).format("ll")}</p>
                  {apr && (
                    <p>
                      Your estimated current APR: <span className={classes.apr}>{`~${apr}%`}</span>
                    </p>
                  )}
                </>
              ) : null}
              <p className={classes.thanks}>{thanksMessage}</p>
            </section>
          )}
        </main>
      </div>
    </>
  )
}

export default Calculator
