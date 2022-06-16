import { useState } from 'react'
import classes from './Rewards.module.scss'

type Props = {
    totalRewards: number;
    startDate: string;
};

const Rewards = ({ 
    totalRewards, 
    startDate,
}: Props) => {
    return <section className={classes.root}>
            {true && <div>
                <p>You have earned</p>
                <div className={classes.rewards}>{totalRewards} CAPS</div>
                <p>since {startDate}</p>
            </div>}
            <button>Tell me !</button>
    </section>
}


export default Rewards