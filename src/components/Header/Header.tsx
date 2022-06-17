import classes from './Header.module.scss'

type Props = {
    pageName: string;
    icon?: string;
};

const Header = ({ pageName, icon }: Props) => 
    <header className={classes.root}>
        {icon !== undefined && <img src={icon} alt={pageName + " icon"} />}
        {pageName}
    </header>

export default Header
