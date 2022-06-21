import classes from "./Header.module.scss";

type Props = {
  pageNameXs?: string;
  pageName: string;
  icon?: string;
  navLinks?: {
    label: string;
    title: string;
    uri: string;
  }[];
};

const Header = ({ pageNameXs, pageName, icon, navLinks }: Props) => (
  <header className={classes.root}>
    <div className={classes.left}>
      {icon !== undefined && (
        <img className={classes.icon} src={icon} alt={pageName + " icon"} />
      )}
      {pageNameXs && <div className={classes.pageNameXs}>{pageNameXs}</div>}
      <div className={pageNameXs ? classes.pageNameLg : ""}>{pageName}</div>
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
