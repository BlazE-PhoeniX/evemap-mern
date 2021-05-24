import { Link } from "react-router-dom";

const SideNavItem = props => {
  return (
    <li className={props.active ? "side-nav--active" : ""}>
      <Link to={props.link}>{props.children}</Link>
    </li>
  );
};

export default SideNavItem;
