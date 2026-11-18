
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

function buildSchedule(guards, stations, start, end, interval) {
    if (stations.length === 0) {
        throw new Error("No stations provided");
    }
    if (guards.length < stations.length) {
        throw new Error("Not enough guards for the number of stations");
    }
    if (!(interval > 0)) {
        throw new Error("Interval rotation must be a positive number");
    }

    const startMinutes = toMinutes(start);
    let endMinutes = toMinutes(end);
    if (endMinutes <= startMinutes) {
        endMinutes += 24 * 60; // Handle overnight shifts past midnight
    }

    const breaks = guards.length - stations.length;
    const positions=[...stations];
    for (let i = 1; i <= breaks; i++) {
        if (breaks === 1) {
            positions.push("Break");
        } else {
            positions.push("Break " + i);
        }

        
}
    const rows = [];
    let round = 0;
    for (let t = startMin; t < endMin; t += interval) {
        const assignments = {};
        for (let g = 0; g < guards.length; g++) {
        const pos = (g + round) % positions.length;
        assignments[positions[pos]] = guards[g];
        }
        rows.push({ time: formatTime(t), assignments });
        round++;
    }
    return { positions, rows };

}