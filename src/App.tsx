import Main from './components/Main/Main'
import Header from './components/Header/Header'

import classes from './App.module.scss'

const App = () => 
  <div className={classes.root}>
    <Header />
    <Main />
  </div>

export default App
