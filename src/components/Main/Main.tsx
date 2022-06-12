import classes from './Main.module.scss'

import Chain from '../Chain/Chain'
import Separator from '../Separator/Separator'

import NemeanLion from '../../assets/lion.svg'
import TernoaLogo from '../../assets/ternoa.svg'

const TernoaAddress = '5Hpd4Z7Nb5jPSGGkGoUtypsBstv7CnUTW2hgLP1uqZnVLA9r'

const Main = () => <main className={classes.root}>
        <Separator />
        <p className={classes.intro}>
            We aim at securing 12 blockchains within the 12 labors of Heracles. <br />
            Each labors will be a staking opportunity for you to participate to a blockchain mining process. <br />
            Our first node is the first labor of Heracles and is currently active on the Ternoa Network.
        </p>
        <Separator />
        <Chain
            name='Heracles against the Nemean Lion'
            description='Validator node on the blockain Ternoa'
            chain='Ternoa'
            chainLogo={TernoaLogo}
            chainAddress={TernoaAddress}
            picture={NemeanLion}
        />
    </main>


export default Main