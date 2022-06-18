import classes from "./Header.module.scss";

type Props = {
  pageName: string;
  icon?: string;
  navLinks?: {
    label: string;
    title: string;
    uri: string;
  }[];
};

const Header = ({ pageName, icon, navLinks }: Props) => (
  <header className={classes.root}>
    <div className={classes.left}>
      {icon !== undefined && <img className={classes.icon} src={icon} alt={pageName + " icon"} />}
      {pageName}
    </div>
    {navLinks && (
      <div className={classes.right}>
        {navLinks.map(({ label, title, uri }) => (
          <a key={uri} className={classes.navLink} href={uri} title={title}>
            {label}
          </a>
        ))}
      </div>
    )}
  </header>
);

export default Header;
