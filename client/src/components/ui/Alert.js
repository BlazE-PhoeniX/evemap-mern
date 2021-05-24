const Alert = props => {
  return (
    <div className={`alert alert--${props.type}`}>
      <strong>{props.message}</strong>
    </div>
  );
};

export default Alert;
