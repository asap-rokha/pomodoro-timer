export function timeConverter(secs) {
  const minutes = Math.floor(secs / 60);
  const seconds = secs % 60;
  const display = `${minutes < 10 ? "0" : ""}${minutes}:${
    seconds < 10 ? "0" : ""
  }${seconds}`;

  return display;
}

export function convertInSeconds(value) {
  return value * 60;
}

export function convertInMinutes(value) {
  return value / 60;
}
