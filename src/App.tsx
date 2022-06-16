import Footer from './components/Footer/Footer'
import Header from './components/Header/Header'

import Home from './pages/Home/Home'

import classes from './App.module.scss'


const App = () => 
  <div className={classes.root}>
    <Header pageName='CAPS staking calculator'/>
    <div className={classes.container}>
      <Home />
    </div>
    <Footer />
  </div>

export default App
