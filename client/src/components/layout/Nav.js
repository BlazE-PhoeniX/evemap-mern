import Avatar from "./Avatar";
import NavItem from "./NavItem";

const Nav = props => {
  return (
    <nav className="nav nav--user">
      {props.user && (
        <>
          <NavItem className="nav__el-user" href="/me">
            <Avatar /> {props.user.name}
          </NavItem>
          <NavItem className="nav__el--cta" href="/me">
            Profile
          </NavItem>
        </>
      )}
      {!props.user && (
        <>
          <NavItem href="/login">Log in</NavItem>
          <NavItem className="nav__el--cta" href="/signup">
            Sign up
          </NavItem>
        </>
      )}
    </nav>
  );
};

export default Nav;
