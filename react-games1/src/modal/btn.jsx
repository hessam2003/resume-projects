import "./btn.css";
export const Btn = (props) => {
  const classes=["btn"]
  switch (props.type) {
    case "danger":
      classes.push("danger")
      break;
  
    default:
      break;
  }
  return (
    <button
      onClick={props.changeGameFlow}
      className={classes.join(" ")}
    >{props.value}</button>
  );
};
