import { useDispatch } from "react-redux";
import useInput, { touchAll, validateAll } from "../../hooks/use-input";
import Input from "../ui/Input";
import { coordsActions } from "../../store/coords";
import { hideCoordsGetter } from "../../store/ui";

const Form = props => {
  const dispatchRedux = useDispatch();

  const lat = useInput({
    validate: value =>
      /^(\+|-)?(?:90(?:(?:\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,6})?))$/.test(
        value.trim()
      ),
  });
  const lng = useInput({
    validate: value =>
      /^(\+|-)?(?:180(?:(?:\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,6})?))$/.test(
        value.trim()
      ),
  });

  const formSubmitHandler = async e => {
    e.preventDefault();
    touchAll(lat, lng);

    if (!validateAll(lat, lng)) {
      return;
    }

    localStorage.setItem("coords", lat.value + ", " + lng.value);
    dispatchRedux(coordsActions.addCoords({ lat: lat.value, lng: lng.value }));
    dispatchRedux(hideCoordsGetter());
  };

  return (
    <form onSubmit={formSubmitHandler} noValidate className="form form--coords">
      <Input
        label="Latitude"
        input={{
          className: "form__input",
          id: "lat",
          type: "number",
          placeholder: "12.4567890",
          value: lat.value,
          onChange: lat.onChange,
          onBlur: lat.onBlur,
        }}
        invalid={lat.inputIsInvalid}
        errorMsg="Not a valid coordinate"
      />
      <Input
        className="ma-bt-lg"
        label="Longitude"
        input={{
          className: "form__input",
          id: "lng",
          type: "number",
          placeholder: "60.1234567",
          value: lng.value,
          onChange: lng.onChange,
          onBlur: lng.onBlur,
        }}
        invalid={lng.inputIsInvalid}
        errorMsg="Not a valid coordinate"
      />
      <div className="form__group right">
        <button className="btn btn--green btn--small">
          Submit Coordinates
        </button>
      </div>
    </form>
  );
};

export default Form;
