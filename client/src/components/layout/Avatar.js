import userAvatar from "../../resources/user.svg";

const Avatar = props => {
  return <img className="nav__user-img" src={userAvatar} alt="user svg" />;
};

export default Avatar;
