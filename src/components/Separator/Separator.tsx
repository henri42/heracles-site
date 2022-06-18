import classes from './Separator.module.scss'
import Snail from '../../assets/snail.svg'

const Separator = () => 
    <div className={classes.root}>
        <img src={Snail} alt="greek pattern" width={17.5} height={16}/>
        <img src={Snail} alt="greek pattern" width={17.5} height={16}/>
        <img src={Snail} alt="greek pattern" width={17.5} height={16}/>
    </div>

export default Separator