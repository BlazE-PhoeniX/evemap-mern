import mapboxgl from "!mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";

let map;

export const displayMap = async (mapRef, history, showModal, user, coords) => {
  mapboxgl.accessToken =
    "pk.eyJ1IjoiYmxhemVwaG9lbml4IiwiYSI6ImNrbmFkNXJiYjBtcTYzMG55NHNycmlwdHYifQ.atR50NlMkXlMTn52AxgrfA";

  const lat = coords.lat;
  const lng = coords.lng;

  map = new mapboxgl.Map({
    container: mapRef.current,
    style: "mapbox://styles/blazephoenix/ckno6lf0x0kw617mes8rxflhq",
    center: [lng, lat],
    zoom: 10,
  });

  map.addControl(
    new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
    })
  );
  map.addControl(new mapboxgl.NavigationControl());

  map.on("click", async e => {
    if (user) {
      showModal([e.lngLat.lng, e.lngLat.lat]);
    } else {
      history.push("/login");
    }
  });
};

export const addToMap = event => {
  const point = {};
  point.marker = new mapboxgl.Marker({
    color: "#1976d2",
  })
    .setLngLat(event.location.coordinates)
    .addTo(map);

  point.popup = new mapboxgl.Popup({
    closeOnClick: false,
    anchor: "bottom",
    focusAfterOpen: false,
    offset: 30,
  })
    .setLngLat(event.location.coordinates)
    .setHTML(`<p>${event.status}</p>`)
    .setMaxWidth("400px")
    .addTo(map);

  return point;
};

export const moveToView = async event => {
  if (event) {
    map.flyTo({
      center: event.location.coordinates,
      zoom: 13,
    });
  }
};
