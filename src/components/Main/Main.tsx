import classes from "./Main.module.scss";

import Chain from "../Chain/Chain";
import Separator from "../Separator/Separator";

import NemeanLion from "../../assets/lion.svg";
import TernoaLogo from "../../assets/ternoa.svg";
import { useAppSelector } from "../../redux/hooks";
import WalletModal from "../Modals/WalletModal/WalletModal";

const TernoaAddress = "5FWuM8Q3DRBAzu2PeqfmXqwdnegk8yiiMLXtZLB3dqJjomG8";

const Main = () => {
  const { app } = useAppSelector((state) => state.app);

  const { isWalletModalOpen } = app;
  return (
    <main className={classes.root}>
      <Separator />
      <p className={classes.intro}>
        We aim at securing 12 blockchains within the 12 labors of Heracles.
        <br />
        Earn rewards by helping Heracles on each staking opportunity.
        <br />
        Participate in the next evolution of the internet.
        <br />
        <br />
        Our first node is the first labor of Heracles and is currently active on
        the Ternoa mainnet network.
      </p>
      <Separator />
      <Chain
        name="Heracles against the Nemean Lion"
        description="Validator node on the Ternoa mainnet"
        chain="Ternoa"
        chainLogo={TernoaLogo}
        chainAddress={TernoaAddress}
        picture={NemeanLion}
      />
      <p className={classes.teasing}>More nodes are coming...</p>
      {/* <WalletModal isOpen={isWalletModalOpen} /> */}
    </main>
  );
};

export default Main;
