import { useDispatch, useSelector } from "react-redux";
import { useHistory, useRouteMatch } from "react-router";
import { Link } from "react-router-dom";
import { logoutUser } from "../../store/auth";
import SideNavItem from "./SideNavItem";

const SideNav = props => {
  const match = useRouteMatch();
  const dispatchRedux = useDispatch();
  const history = useHistory();
  const user = useSelector(state => state.auth.user);

  const logoutHandler = async e => {
    e.preventDefault();
    dispatchRedux(logoutUser(history, user));
  };

  return (
    <nav className="user-view__menu">
      <ul className="side-nav">
        <SideNavItem link="/me" active={match.path === "/me" ? true : false}>
          My profile
        </SideNavItem>
        <SideNavItem
          link="/events"
          active={match.path === "/events" ? true : false}>
          My events
        </SideNavItem>
        <SideNavItem
          link="/change-password"
          active={match.path === "/change-password" ? true : false}>
          Change Password
        </SideNavItem>
        <li className="side-nav--logout">
          <Link onClick={logoutHandler} to="/">
            logout
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default SideNav;
