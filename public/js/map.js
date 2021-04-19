import { openModalToAdd } from "./model";

let map;

export const displayMap = async () => {
  mapboxgl.accessToken =
    "pk.eyJ1IjoiYmxhemVwaG9lbml4IiwiYSI6ImNrbmFkNXJiYjBtcTYzMG55NHNycmlwdHYifQ.atR50NlMkXlMTn52AxgrfA";

  let coords;
  try {
    coords = await new Promise(function (resolve, reject) {
      navigator.geolocation.getCurrentPosition(
        function (e) {
          resolve(e.coords);
        },
        function () {
          reject(new Error("location permission denied"));
        },
        {
          enableHighAccuracy: true,
        }
      );
    });
  } catch (err) {
    console.log(err.message);
  }

  const lat = coords ? coords.latitude : 13.1255523;
  const lng = coords ? coords.longitude : 79.905998;

  map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/blazephoenix/ckno6lf0x0kw617mes8rxflhq",
    center: [lng, lat],
    zoom: 10,
  });

  // Add the control to the map.
  map.addControl(
    new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
    })
  );
  map.addControl(new mapboxgl.NavigationControl());

  map.on("click", async e => {
    const res = await (await fetch(`/api/v1/users/check-login`)).json();

    if (res.loggedIn) {
      openModalToAdd(e.lngLat);
    } else {
      location.assign("/login");
    }
  });
};

export const addToMap = event => {
  var marker = new mapboxgl.Marker({
    color: "#1976d2",
  })
    .setLngLat(event.location.coordinates)
    .addTo(map);

  var popup = new mapboxgl.Popup({
    closeOnClick: false,
    anchor: "bottom",
    focusAfterOpen: false,
    offset: 30,
  })
    .setLngLat(event.location.coordinates)
    .setHTML(`<p>${event.status}</p>`)
    .setMaxWidth("400px")
    .addTo(map);
};

export const moveToView = async eventId => {
  if (eventId !== "") {
    try {
      const res = await (await fetch(`/api/v1/events/${eventId}`)).json();
      const event = res.data.event;

      map.flyTo({
        center: event.location.coordinates,
        zoom: 13,
      });
    } catch (err) {
      showAlert("error", err.message);
      return;
    }
  }
};
