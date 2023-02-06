import NemeanLion from "../../assets/lion.svg"
import Hydra from "../../assets/hydra.svg"
import Header from "../../components/Header/Header"
import Stake from "../../components/Stake/Stake"
import Separator from "../../components/Separator/Separator"
import { HERACLES_02_NODE_ADDRESS, HERACLES_NODE_ADDRESS } from "../../constants"

import classes from "./Home.module.scss"

const Home = () => (
  <>
    <Header
      pageName="Heracles"
      navLinks={[
        {
          label: "Calculator ▸",
          title: "Staking rewards Calculator",
          uri: "https://calculator.heracles.works",
        },
      ]}
    />
    <div className={classes.container}>
      <main className={classes.root}>
        <h1 className={classes.title}>12 Labors of Heracles</h1>
        <h2 className={classes.subtitle}>Proof of Stake validator nodes</h2>
        <Separator />
        <p className={classes.intro}>
          HERACLES is a trusted Proof-of-Stake infrastructure provider and validator to comfortably stake your coins and
          earn daily rewards.
        </p>
        <section className={classes.whyBox}>
          <h3 className={classes.boxTitle}>Why nominating HERACLES ?</h3>
          <div>
            <p>Our nodes rely on a highly secure and reliable infrastructure.</p>
            <p>We are a french team composed of experimented Devops Engineers and a Software Blockchain Engineer.</p>
            <p>The whole system is monitored 24/7 with an alerting system always up and running.</p>
          </div>
        </section>
        <section className={classes.nodesBox}>
          <h3 className={classes.boxTitle}>Discover our nodes</h3>
          <div className={classes.node}>
            <h4 className={classes.nodeName}>1. Heracles against the Nemean Lion</h4>
            <p className={classes.nodeDescription}>Ternoa Staking</p>
            <div className={classes.nodeData}>
              <img className={classes.picture} src={NemeanLion} alt="Lion illustration" width={280} height={111} />
              <Stake address={HERACLES_NODE_ADDRESS} />
            </div>
          </div>
          <Separator />
          <div className={classes.node}>
            <h4 className={classes.nodeName}>2. Heracles against the Lernaean Hydra</h4>
            <p className={classes.nodeDescription}>Ternoa Staking</p>
            <div className={classes.nodeData}>
              <img className={classes.picture} src={Hydra} alt="Hydra illustration" width={310} height={161} />
              <Stake address={HERACLES_02_NODE_ADDRESS} />
            </div>
          </div>
          <Separator />
          <p className={classes.teasing}>More nodes are coming...</p>
        </section>
      </main>
    </div>
  </>
)

export default Home
