import classes from './Separator.module.scss'
import Snail from '../../assets/snail.svg'

const Separator = () => 
    <div className={classes.root}>
        <img src={Snail} alt="greek pattern" />
        <img src={Snail} alt="greek pattern" />
        <img src={Snail} alt="greek pattern" />
    </div>

export default Separator