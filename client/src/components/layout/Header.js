import Logo from "./Logo";
import { useSelector } from "react-redux";

import Nav from "./Nav";
import { useEffect, useState } from "react";
import MenuIcon from "./MenuIcon";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const getDateString = date => {
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
};

const getTimeString = date => {
  return `${date.getHours() === 12 ? 12 : date.getHours() % 12} : ${(
    date.getMinutes() + ""
  ).padStart(2, "0")} ${date.getHours() < 12 ? "AM" : "PM"}`;
};

const Header = props => {
  const user = useSelector(state => state.auth.user);
  const [timeString, setTimeString] = useState(getTimeString(new Date()));

  useEffect(() => {
    setInterval(() => {
      setTimeString(getTimeString(new Date()));
    }, 1000);
  }, []);

  return (
    <header className="header">
      <nav className="nav nav--tours">
        <p className="nav__el nav__el--time">
          <span>{getDateString(new Date())}</span>
          <span>{timeString}</span>
        </p>
      </nav>
      <Logo />
      <Nav user={user} />
      <MenuIcon />
    </header>
  );
};

export default Header;
