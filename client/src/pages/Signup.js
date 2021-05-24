import Form from "../components/signup/Form";

const Signup = props => {
  return (
    <main className="main">
      <div className="login-form">
        <h2 className="heading-secondary ma-bt-lg">create account</h2>
        <Form />
      </div>
    </main>
  );
};

export default Signup;
