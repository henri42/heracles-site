import classes from './Home.module.scss'

import Chain from '../../components/Chain/Chain'
import Separator from '../../components/Separator/Separator'

import NemeanLion from '../../assets/lion.svg'
import TernoaLogo from '../../assets/ternoa.svg'
import Banner from '../../components/Banner/Banner'
import { HERACLES_NODE_ADDRESS } from '../../constants'



const Home = () => <main className={classes.root}>
        <Banner />
        <Separator />
        <p className={classes.intro}>
            We aim at securing 12 blockchains within the 12 labors of Heracles.<br />
            Earn rewards by helping Heracles on each staking opportunity.<br />
            Participate in the next evolution of the internet.<br />
            <br />
            Our first node is the first labor of Heracles and is currently active on the Ternoa mainnet network.
        </p>
        <Separator />
        <Chain
            name='Heracles against the Nemean Lion'
            description='Validator node on the Ternoa mainnet'
            chain='Ternoa'
            chainLogo={TernoaLogo}
            chainAddress={HERACLES_NODE_ADDRESS}
            picture={NemeanLion}
        />
        <p className={classes.teasing}>More nodes are coming...</p>
    </main>


export default Home