import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useInput, { touchAll, validateAll } from "../../hooks/use-input";
import {
  deleteOneEvent,
  postOneEvent,
  updateOneEvent,
} from "../../store/events";
import TableInput from "./TableInput";

const prefixZero = number => {
  return number < 10 ? `0${number}` : `${number}`;
};

const Form = props => {
  const googleMapLink = useRef();
  const [formError, setFormError] = useState(null);

  const user = useSelector(state => state.auth.user);
  const coords = useSelector(state => state.coords);
  const events = useSelector(state => state.events.events);
  const dispatchRedux = useDispatch();

  const event = {
    id: useInput({ validate: value => value.trim() !== "" }),
    name: useInput({ validate: value => value.trim() !== "" }),
    date: useInput({ validate: value => value.trim() !== "" }),
    time: useInput({ validate: value => value.trim() !== "" }),
    description: useInput({ validate: value => value.trim() !== "" }),
    address: useInput({ validate: value => value.trim() !== "" }),
    lat: useInput({ validate: value => value.trim() !== "" }),
    lng: useInput({ validate: value => value.trim() !== "" }),
  };

  useEffect(() => {
    (async () => {
      if (props.eventId) {
        const eventData = {
          ...events.find(event => event.id === props.eventId),
        };
        eventData.date = new Date(eventData.date);

        event.id.setValue(eventData.id);
        event.name.setValue(eventData.name);
        event.date.setValue(
          `${eventData.date.getFullYear()}-${prefixZero(
            eventData.date.getMonth() + 1
          )}-${prefixZero(eventData.date.getDate())}`
        );
        event.time.setValue(
          `${prefixZero(eventData.date.getHours())}:${prefixZero(
            eventData.date.getMinutes()
          )}:00`
        );
        event.description.setValue(eventData.description);
        event.address.setValue(eventData.location.address);
        event.lat.setValue(eventData.location.coordinates[1] + "");
        event.lng.setValue(eventData.location.coordinates[0] + "");

        googleMapLink.current.href = `https://www.google.co.in/maps/@${eventData.location.coordinates[1]},${eventData.location.coordinates[0]},18z`;
      }

      if (props.coords) {
        event.lat.setValue(props.coords[1] + "");
        event.lng.setValue(props.coords[0] + "");
      }
    })();
    //eslint-disable-next-line
  }, []);

  const formSubmitHandler = async e => {
    e.preventDefault();

    setFormError(null);

    touchAll(
      event.name,
      event.date,
      event.time,
      event.description,
      event.address
    );

    if (
      !validateAll(
        event.name,
        event.date,
        event.time,
        event.description,
        event.address
      )
    ) {
      setFormError({ message: "Provide all the neccessary details" });
      return;
    }

    const eventDate = new Date(`${event.date.value}T${event.time.value}`);
    if (Date.now() > eventDate.getTime()) {
      setFormError({
        message:
          "Provided date and time have already passed, Please check again",
      });
      return;
    }

    if (event.id.value !== "") {
      dispatchRedux(updateOneEvent(event, coords, props.closeModal, user));
    } else {
      dispatchRedux(postOneEvent(event, coords, props.closeModal, user));
    }
  };

  const showModal = e => {
    props.showFilledModalEdit(event.id.value);
  };

  const deleteEvent = async () => {
    if (event.id.value !== "") {
      dispatchRedux(deleteOneEvent(event.id.value, props.closeModal, user));
    }
  };

  return (
    <form noValidate onSubmit={formSubmitHandler}>
      {formError && <p className="form-error">{formError.message}</p>}
      <input
        value={event.id.value}
        className="table__input"
        id="event-id"
        type="hidden"
        readOnly
      />
      <input
        value={event.lat.value}
        className="table__input"
        id="event-lat"
        type="hidden"
        readOnly
      />
      <input
        value={event.lng.value}
        className="table__input"
        id="event-lng"
        type="hidden"
        readOnly
      />
      <table>
        <tbody>
          <TableInput
            label="Name"
            input={{
              className: "table__input",
              id: "event-name",
              type: "text",
              value: event.name.value,
              onChange: event.name.onChange,
              onBlur: event.name.onBlur,
            }}
            invalid={event.name.inputIsInvalid}
            errorMsg="Name must not be an empty string!"
            readOnly={!props.editMode}
          />
          <TableInput
            label="Date"
            input={{
              className: "table__input",
              id: "event-date",
              type: "date",
              value: event.date.value,
              onChange: event.date.onChange,
              onBlur: event.date.onBlur,
            }}
            invalid={event.date.inputIsInvalid}
            errorMsg="Please provide a date!"
            readOnly={!props.editMode}
          />
          <TableInput
            label="Time"
            input={{
              className: "table__input",
              id: "event-time",
              type: "time",
              value: event.time.value,
              onChange: event.time.onChange,
              onBlur: event.time.onBlur,
            }}
            invalid={event.time.inputIsInvalid}
            errorMsg="Please provide a time!"
            readOnly={!props.editMode}
          />
          <TableInput
            label="Description"
            input={{
              className: "table__input",
              id: "event-desc",
              type: "text",
              value: event.description.value,
              onChange: event.description.onChange,
              onBlur: event.description.onBlur,
            }}
            invalid={event.description.inputIsInvalid}
            errorMsg="Description must not be an empty string!"
            readOnly={!props.editMode}
          />
          <TableInput
            label="Address"
            input={{
              className: "table__input",
              id: "event-addr",
              type: "text",
              value: event.address.value,
              onChange: event.address.onChange,
              onBlur: event.address.onBlur,
            }}
            invalid={event.address.inputIsInvalid}
            errorMsg="Address must not be an empty string!"
            readOnly={!props.editMode}
          />
        </tbody>
      </table>
      <div className="btn-grp">
        {props.editMode && (
          <button type="submit" className="model__btn model__btn--save">
            Save
          </button>
        )}
        {!props.editMode && (
          <button
            onClick={showModal}
            type="button"
            className="model__btn model__btn--edit">
            Edit
          </button>
        )}
        <button
          type="button"
          onClick={deleteEvent}
          className="model__btn model__btn--delete">
          Delete
        </button>
        <a ref={googleMapLink} className="maps-link" href="/" target="_blank">
          {"Open in google maps >>"}
        </a>
      </div>
    </form>
  );
};

export default Form;
