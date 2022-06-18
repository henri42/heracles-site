import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";

import Home from "./pages/Home/Home";
import Calculator from "./pages/Calculator/Calculator";

import CalculatorIcon from "./assets/calculator.svg";

import classes from "./App.module.scss";

const App = () => {
  const subdomain = window.location.host.split(".")[0];
  const isCalculator = subdomain === "calculator";

  return (
    <div className={classes.root}>
      {isCalculator ? <Calculator /> : <Home />}
      <Footer />
    </div>
  );
};

export default App;
