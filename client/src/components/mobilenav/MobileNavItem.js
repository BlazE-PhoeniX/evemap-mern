import { useDispatch, useSelector } from "react-redux";
import { NavLink, useHistory } from "react-router-dom";
import { logoutUser } from "../../store/auth";
import { hideMobileNav } from "../../store/ui";
import "./MobileNavItem.css";

const MobileNavItem = props => {
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useSelector(state => state.auth.user);

  const gotoUrl = e => {
    e.preventDefault();
    dispatch(hideMobileNav());

    if (props.url !== "/logout") {
      history.push(props.url);
      return;
    }

    dispatch(logoutUser(history, user));
  };

  return (
    <div className="mobile-nav-item">
      <NavLink
        onClick={gotoUrl}
        activeClassName="mobile-nav-link-active"
        className="mobile-nav-link"
        to={props.url}>
        {props.label}
      </NavLink>
    </div>
  );
};

export default MobileNavItem;
