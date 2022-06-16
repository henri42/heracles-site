import Footer from './components/Footer/Footer'
import Header from './components/Header/Header'

import Home from './pages/Home/Home'
import Calculator from './pages/Calculator/Calculator'

import classes from './App.module.scss'


const App = () => 
  <div className={classes.root}>
    <Header pageName='Ternoa Staking Rewards Calculator'/>
    <div className={classes.container}>
      {/* <Home /> */}
      <Calculator />
    </div>
    <Footer />
  </div>

export default App
