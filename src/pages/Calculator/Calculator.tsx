import classes from './Calculator.module.scss'

import TernoaLogo from '../../assets/ternoa.svg'
import Rewards from '../../components/Rewards/Rewards'


const Calculator = () => {
    return <main className={classes.root}>
        <h2>
            Calculate your staking rewards <br />
            on <img src={TernoaLogo} alt="Ternoa Logo" /> network
        </h2>
        <div className={classes.input}>
            <label htmlFor="">Enter your nominator account address</label>
            <input type="text" />
        </div>
        <Rewards startDate='June 3, 2022' totalRewards={26781} />
    </main>
}

export default Calculator