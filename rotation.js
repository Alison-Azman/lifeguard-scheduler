
// "09:30" -> 570
function toMinutes(time) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

// 570 -> "9:30 AM"
function formatTime(minutes) {
  let hours = Math.floor(minutes / 60);
  let mins = minutes % 60;

  let period;
  if (hours < 12) {
    period = "AM";
  } else {
    period = "PM";
  }

  mins = String(mins).padStart(2, "0");
  hours = (hours % 12) || 12;
  return `${hours}:${mins} ${period}`;

}