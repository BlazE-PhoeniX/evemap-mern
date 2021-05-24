import { Link } from "react-router-dom";
import logo from "../../resources/logo.png";

const Logo = props => {
  return (
    <div className="header__logo">
      <Link to="/">
        <img src={logo} alt="Evemap logo" />
      </Link>
    </div>
  );
};

export default Logo;
