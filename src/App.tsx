import Main from './components/Main/Main'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'

import classes from './App.module.scss'

const App = () => 
  <div className={classes.root}>
    <div className={classes.container}>
      <Header />
      <Main />
    </div>
    <Footer />
  </div>

export default App
