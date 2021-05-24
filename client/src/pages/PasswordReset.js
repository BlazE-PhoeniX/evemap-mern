import Form from "../components/resetpassword/Form";

const PasswordReset = props => {
  return (
    <main className="main">
      <div className="login-form">
        <h2 className="heading-secondary ma-bt-lg">Enter your new Password</h2>
        <Form />
      </div>
    </main>
  );
};

export default PasswordReset;
