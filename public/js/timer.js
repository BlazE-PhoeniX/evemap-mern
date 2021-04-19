const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const getDateString = date => {
  return `<span>${
    months[date.getMonth()]
  } ${date.getDate()}, ${date.getFullYear()}</span>
    <span>${date.getHours() == 12 ? 12 : date.getHours() % 12} : ${(
    date.getMinutes() + ""
  ).padStart(2, "0")} ${date.getHours() < 12 ? "AM" : "PM"}</span>`;
};

export const setTimer = timer => {
  const date = new Date();
  timer.innerHTML = getDateString(date);

  setInterval(() => {
    const date = new Date();
    timer.innerHTML = getDateString(date);
  }, 1000);
};
