import { Provider } from 'react-redux'

import Main from './components/Main/Main'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import { store } from './redux/store'

import classes from './App.module.scss'

const App = () => 
<Provider store={store}>
  <div className={classes.root}>
    <div className={classes.container}>
      <Header />
      <Main />
    </div>
    <Footer />
  </div>
  </Provider>

export default App
