import Form from "../components/account/Form";
import SideNav from "../components/sidenav/SideNav";

const UserAccount = props => {
  return (
    <main className="main">
      <div className="user-view">
        <SideNav />
        <div className="user-view__content">
          <div className="user-view__form-container">
            <h2 className="heading-secondary ma-bt-md">
              Your account settings
            </h2>
            <Form />
          </div>
        </div>
      </div>
    </main>
  );
};

export default UserAccount;
