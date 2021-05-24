const { default: Header } = require("./Header");

const Layout = props => {
  return (
    <>
      <Header />
      {props.children}
    </>
  );
};

export default Layout;
