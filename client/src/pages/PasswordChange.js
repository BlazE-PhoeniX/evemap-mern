import Form from "../components/changepassword/Form";
import SideNav from "../components/sidenav/SideNav";

const PasswordChange = props => {
  return (
    <main className="main">
      <div className="user-view">
        <SideNav />
        <div className="user-view__content">
          <div className="user-view__form-container">
            <h2 className="heading-secondary ma-bt-md">Password change</h2>
            <Form />
          </div>
        </div>
      </div>
    </main>
  );
};

export default PasswordChange;
