import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

import { IRewardsData } from "../../types/pallets"

import classes from "./Chart.module.scss"

interface Props {
  data: IRewardsData
}

export const formatPrice = (
  n: number,
  options: Intl.NumberFormatOptions = {
    style: "currency",
    currency: "USD",
  },
) => {
  const formatter = new Intl.NumberFormat("en-US", options)

  return formatter.format(n)
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const { formattedRewards, formattedTimestamp, numberedTotal } = payload[0].payload
    return (
      <div className={classes.customTooltip}>
        <p className={classes.label}>{`${formatPrice(numberedTotal, {})} CAPS`}</p>
        <p className={classes.sublabel}>{`${formattedTimestamp} : ${formattedRewards}`}</p>
      </div>
    )
  }

  return null
}

const Chart = ({ data }: Props) => (
  <div className={classes.root}>
    <ResponsiveContainer>
      <LineChart
        width={500}
        height={240}
        data={data}
        margin={{
          top: 24,
          right: 32,
          left: 0,
          bottom: 0,
        }}
      >
        <XAxis dataKey="formattedTimestamp" />
        <YAxis
          dataKey="numberedTotal"
          tickFormatter={(tick) => {
            if (tick > 1000) return `${tick / 1000}k`
            return tick
          }}
        />
        <Line type="monotone" dataKey="numberedTotal" stroke="#000" strokeWidth={2} />
        <Tooltip content={<CustomTooltip />} cursor={false} />
      </LineChart>
    </ResponsiveContainer>
  </div>
)

export default Chart
