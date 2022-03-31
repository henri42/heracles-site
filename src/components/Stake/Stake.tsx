import classes from './Stake.module.scss'

type Props = {
    address: string;
};

const Stake = ({ address }: Props) => 
    <div className={classes.root}>
        <a className={classes.stakeLink} href="#">Start Staking</a>
        <span>{address}</span>
    </div>

export default Stake