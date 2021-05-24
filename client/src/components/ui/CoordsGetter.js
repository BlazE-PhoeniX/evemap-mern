import Form from "../coordsgetter/Form";
import "./CoordsGetter.css";

const CoordsGetter = props => {
  return (
    <div className="coords-getter-bg">
      <div className="coords-getter">
        <div className="coords-getter-ins">
          <h2 className="coords-getter-ins-header">Instructions</h2>
          <p className="coords-getter-ins-para">
            Since we can't get your location, You need to enter it manually!
          </p>
          <p className="coords-getter-ins-para">
            Don't worry this is a one time thing 😉
          </p>
          <p className="coords-getter-ins-para">
            click{" "}
            <a
              target="_blank"
              href="https://www.gps-coordinates.net/my-location"
              rel="noreferrer">
              here
            </a>{" "}
            to get your coordinates.
          </p>
          <p className="coords-getter-ins-para">
            If possible, visit the below link in mobile to get coordinates with
            more accuracy 😁
          </p>
          <p className="coords-getter-ins-para link">
            https://www.gps-coordinates.net/my-location
          </p>
        </div>
        <Form />
      </div>
    </div>
  );
};

export default CoordsGetter;
