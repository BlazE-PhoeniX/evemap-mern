export const getEvents = async query => {
  const res = await (
    await fetch(`/api/v1/events/${query ? "?" + query : ""}`)
  ).json();
  if (res.status === "success") {
    return res.data.events;
  } else {
    return [];
  }
};

function distance(lat1, lon1, lat2, lon2, unit) {
  if (lat1 == lat2 && lon1 == lon2) {
    return 0;
  } else {
    var radlat1 = (Math.PI * lat1) / 180;
    var radlat2 = (Math.PI * lat2) / 180;
    var theta = lon1 - lon2;
    var radtheta = (Math.PI * theta) / 180;
    var dist =
      Math.sin(radlat1) * Math.sin(radlat2) +
      Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515;
    if (unit == "K") {
      dist = dist * 1.609344;
    }
    if (unit == "N") {
      dist = dist * 0.8684;
    }
    return dist;
  }
}

export const getEventsWithDistance = async query => {
  let coords;
  try {
    coords = await new Promise(function (resolve, reject) {
      navigator.geolocation.getCurrentPosition(
        function (e) {
          resolve(e.coords);
        },
        function () {
          reject(new Error("Location permission denied"));
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

  const events = await getEvents(query);

  events.forEach(event => {
    event.distance = Math.round(
      distance(
        lat,
        lng,
        event.location.coordinates[1],
        event.location.coordinates[0],
        "K"
      )
    );
  });

  return events;
};

export const addToEventsBox = (event, eventsBox) => {
  event.date = new Date(event.date);

  let html = `
        <li class="event" data-id="${event.id}">
            <h2 class="event__title">${event.name} <span>${
    event.distance
  } km </span></h2>
            <div class="event__details">
                <span class="event__icon">🗓️</span>
                <span class="event__value"> &nbsp;&nbsp;${event.date.toLocaleString(
                  "en-IN",
                  {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  }
                )}</span>
            </div>
            <div class="event__details">
              <span class="event__icon">⏰</span>
              <span class="event__value"> &nbsp;&nbsp;${
                event.date.getHours() == 12 || event.date.getHours() == 0
                  ? 12
                  : event.date.getHours() % 12
              } : ${(event.date.getMinutes() + "").padStart(2, "0")} &nbsp;${
    event.date.getHours() < 12 ? "AM" : "PM"
  }</span>
          </div>
            <div class="overlay">
                <img class="overlay__image overlay__image--open" src="./resources/open.svg" alt="">
                <img class="overlay__image overlay__image--map" src="./resources/map.svg" alt="">
            </div>
        </li>
                `;

  eventsBox.insertAdjacentHTML("beforeend", html);
};
