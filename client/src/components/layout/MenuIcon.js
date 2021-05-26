import { useDispatch } from "react-redux";
import menuIcon from "../../resources/menu.svg";
import { showMobileNav } from "../../store/ui";

const MenuIcon = props => {
  const dispatch = useDispatch();

  const openMobileNav = () => {
    dispatch(showMobileNav());
  };

  return (
    <div onClick={openMobileNav} className="menu-icon">
      <img src={menuIcon} alt="menu icon" />
    </div>
  );
};

export default MenuIcon;
