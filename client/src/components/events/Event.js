import mapIcon from "../../resources/map.svg";
import openIcon from "../../resources/open.svg";
import { moveToView } from "../../utils/map";

const Event = props => {
  const event = { ...props.event };
  event.date = new Date(event.date);

  const viewInMap = () => {
    moveToView(event);
  };

  const viewDetails = () => {
    props.showFilledModal(event.id);
  };

  return (
    <div className="event">
      <h2 className="event__title">
        {event.name} <span>{event.distance} km</span>
      </h2>
      <div className="event__details">
        <span className="event__icon">🗓️ &nbsp;</span>
        <span className="event__value">
          {event.date.toLocaleString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </span>
      </div>
      <div className="event__details">
        <span className="event__icon">⏰ &nbsp;</span>
        <span className="event__value">
          {+event.date.getHours() === 12 || +event.date.getHours() === 0
            ? 12
            : event.date.getHours() % 12}{" "}
          : {(event.date.getMinutes() + "").padStart(2, "0")} &nbsp;
          {event.date.getHours() < 12 ? "AM" : "PM"}
        </span>
      </div>
      <div className="overlay">
        <img
          onClick={viewDetails}
          className="overlay__image overlay__image--open"
          src={openIcon}
          alt="open icon"
        />
        <img
          onClick={viewInMap}
          className="overlay__image overlay__image--map"
          src={mapIcon}
          alt="map icon"
        />
      </div>
    </div>
  );
};

export default Event;
