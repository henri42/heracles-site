import { useEffect } from "react"
import { initializeApi } from "ternoa-js"

import Footer from "./components/Footer/Footer"
import Calculator from "./pages/Calculator/Calculator"
import Home from "./pages/Home/Home"

import classes from "./App.module.scss"

const App = () => {
  const subdomain = window.location.host.split(".")[0]
  const isCalculator = subdomain === "calculator"

  useEffect(() => {
    initializeApi("wss://mainnet.ternoa.io/")
  }, [])

  return (
    <div className={classes.root}>
      {isCalculator ? <Calculator /> : <Home />}
      <Footer />
    </div>
  )
}

export default App
