import classes from './Main.module.scss'

import Chain from '../Chain/Chain'

import NemeanLion from '../../assets/lion.svg'
import TernoaLogo from '../../assets/ternoa.svg'

const TernoaAddress = '5Hpd4Z7Nb5jPSGGkGoUtypsBstv7CnUTW2hgLP1uqZnVLA9r'

const Main = () => <main className={classes.root}>
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