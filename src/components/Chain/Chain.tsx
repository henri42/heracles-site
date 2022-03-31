import Stake from '../Stake/Stake';
import classes from './Chain.module.scss'

type Props = {
    name: string;
    description: string;
    chain: string;
    chainLogo: string;
    chainAddress: string;
    picture: string;
};

const Chain = ({ 
    name, 
    description,
    chain,
    chainLogo,
    chainAddress,
    picture
}: Props) => 
    <section className={classes.root}>
        <div className={classes.info}>
            <h3># {name}</h3>
            <p>{description}</p>
            <img src={chainLogo} alt={chain} />
            <Stake address={chainAddress}/>
        </div>
        <img className={classes.picture} src={picture} alt={`illustration of ${name}`} />
    </section>

export default Chain