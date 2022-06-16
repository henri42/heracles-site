import classes from './Header.module.scss'

type Props = {
    pageName: string;
};

const Header = ({ pageName }: Props) => 
    <header className={classes.root}>
        {pageName}
    </header>

export default Header