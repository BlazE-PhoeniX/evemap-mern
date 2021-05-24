import { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router";
import { displayMap, addToMap } from "../../utils/map";
import { useSelector } from "react-redux";
import qs from "query-string";
import { useLocation } from "react-router";

import "./map.css";
import "./map-geocoder.css";

const sortArray = (array, key, asc) => {
  if (asc) {
    array.sort((obj1, obj2) => {
      if (key === "date") {
        return new Date(obj1[key]).getTime() - new Date(obj2[key]).getTime();
      }
      return obj1[key] - obj2[key];
    });
  } else {
    array.sort((obj1, obj2) => {
      if (key === "date") {
        return new Date(obj2[key]).getTime() - new Date(obj1[key]).getTime();
      }
      return obj2[key] - obj1[key];
    });
  }
};

const isToday = date => {
  const today = new Date();
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
};

const Map = props => {
  const mapRef = useRef();
  const history = useHistory();
  const user = useSelector(state => state.auth.user);
  const coords = useSelector(state => state.coords);
  const events = useSelector(state => state.events.events);
  const location = useLocation();
  const query = qs.parse(location.search);
  const [processedEvents, setProcessedEvents] = useState(events);

  useEffect(() => {
    let eves = [...events];

    if (query.search) {
      const searchTerm = query.search.toLowerCase();
      eves = eves.filter(event =>
        event.name.toLowerCase().startsWith(searchTerm)
      );
    }

    if (query.filter) {
      if (query.filter === "today") {
        eves = eves.filter(event => isToday(new Date(event.date)));
      }

      if (query.filter === "within-50km") {
        eves = eves.filter(event => event.distance <= 50);
      }
    }

    if (query.sort) {
      const [key, order] = query.sort.split("-");
      sortArray(eves, key, order === "asc");
    }

    setProcessedEvents(eves);
  }, [events, query.filter, query.search, query.sort]);

  useEffect(() => {
    displayMap(mapRef, history, props.showEmptyModal, user, coords);
  }, [mapRef, history, props.showEmptyModal, user, coords]);

  useEffect(() => {
    const points = [];
    processedEvents.forEach(event => {
      points.push(addToMap(event));
    });

    return () => {
      points.forEach(point => {
        point.marker.remove();
        point.popup.remove();
      });
    };
  }, [processedEvents]);

  return <div ref={mapRef} id="map"></div>;
};

export default Map;
