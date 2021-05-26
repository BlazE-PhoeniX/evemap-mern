import { useDispatch, useSelector } from "react-redux";
import { hideMobileNav } from "../../store/ui";
import Avatar from "../layout/Avatar";

import "./MobileNav.css";
import MobileNavItem from "./MobileNavItem";

const MobileNav = props => {
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();

  const closeMobileNav = () => {
    dispatch(hideMobileNav());
  };

  return (
    <div onClick={closeMobileNav} className="mobile-nav-bg">
      <div className="mobile-nav">
        <span onClick={closeMobileNav}>&times;</span>
        <nav>
          {!user && (
            <>
              <MobileNavItem label="Login" url="/login" />
              <MobileNavItem label="Signup" url="/signup" />
            </>
          )}
          {user && (
            <>
              <div className="mobile-nav-user">
                <Avatar /> {user.name}
              </div>
              <MobileNavItem label="My Profile" url="/me" />
              <MobileNavItem label="My Events" url="/events" />
              <MobileNavItem label="Change Password" url="/change-password" />
              <MobileNavItem label="Logout" url="/logout" />
            </>
          )}
        </nav>
        <footer>
          <p>&copy; Mini-project by group 3</p>
        </footer>
      </div>
    </div>
  );
};

export default MobileNav;
