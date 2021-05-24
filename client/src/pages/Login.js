import { Link } from "react-router-dom";
import Form from "../components/login/Form";

const Login = props => {
  return (
    <main className="main">
      <div className="login-form">
        <h2 className="heading-secondary ma-bt-lg">Log into your account</h2>
        <Form />
        <p className="forgot-password">
          Couldn't remember your password ?{" "}
          <Link to="/forget-password">click here</Link>
        </p>
      </div>
    </main>
  );
};

export default Login;
