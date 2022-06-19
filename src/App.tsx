import { useEffect } from "react";
import { initializeApi } from "ternoa-js";

import CalculatorIcon from "./assets/calculator.svg";
import Footer from "./components/Footer/Footer";
import Calculator from "./pages/Calculator/Calculator";
import Home from "./pages/Home/Home";

import classes from "./App.module.scss";

const App = () => {
  const subdomain = window.location.host.split(".")[0];
  const isCalculator = subdomain === "calculator";

  useEffect(() => {
    const initApi = async () => {
      await initializeApi("wss://mainnet.ternoa.network");
    }
    initApi()
  }, [])

  return (
    <div className={classes.root}>
      {isCalculator ? <Calculator /> : <Home />}
      <Footer />
    </div>
  );
};

export default App;
