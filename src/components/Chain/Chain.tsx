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
        <div className={classes.banner}>
            <div className={classes.info}>
                <h3 className={classes.title}>1. {name}</h3>
                <p className={classes.description}>{description}</p>
                <div className={classes.logos}>
                    <img src={chainLogo} alt={chain} />
                    <div className={classes.livePill}>Live</div>
                </div>
            </div>
            <img className={classes.picture} src={picture} alt={`illustration of ${name}`} />
        </div>
        <p className={classes.details}>Highly reliable and secure infrastructure / Live and monitored 24-7 / Team of engineers and devops</p>
        <Stake address={chainAddress} />
    </section>

export default Chain