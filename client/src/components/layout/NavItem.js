import { Link } from "react-router-dom";

const NavItem = props => {
  return (
    <Link className={"nav__el " + props.className} to={props.href}>
      {props.children}
    </Link>
  );
};

export default NavItem;
