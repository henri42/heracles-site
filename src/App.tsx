import Footer from './components/Footer/Footer'
import Header from './components/Header/Header'

import Home from './pages/Home/Home'
import Calculator from './pages/Calculator/Calculator'

import classes from './App.module.scss'

const App = () => {
  const subdomain = window.location.host.split(".")[0]
  return <div className={classes.root}>
    <Header pageName='Ternoa Staking Rewards Calculator'/>
    <div className={classes.container}>
      {(subdomain === 'calculator') ? <Calculator /> : <Home />}
    </div>
    <Footer />
  </div>
}


export default App
