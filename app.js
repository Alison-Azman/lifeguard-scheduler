// Turn the textarea text into a list of names
function lines(text) {
  const result = [];
  const parts = text.split("\n");   // cut the text at each new line

  for (let i = 0; i < parts.length; i++) {
    const name = parts[i].trim();   // remove spaces before and after
    if (name !== "") {              // skip blank lines
      result.push(name);
    }
  }

  return result;
}

function render(schedule) {
  const table = document.createElement("table");

  // ----- Header row -----
  const headerRow = document.createElement("tr");

  const timeHeader = document.createElement("th");
  timeHeader.textContent = "Time";
  headerRow.appendChild(timeHeader);

  for (let i = 0; i < schedule.positions.length; i++) {
    const th = document.createElement("th");
    th.textContent = schedule.positions[i];
    headerRow.appendChild(th);
  }

  table.appendChild(headerRow);

  // ----- One row per time slot -----
  for (let r = 0; r < schedule.rows.length; r++) {
    const row = schedule.rows[r];
    const tr = document.createElement("tr");

    // first cell: the time
    const timeCell = document.createElement("td");
    timeCell.textContent = row.time;
    tr.appendChild(timeCell);

    // one cell per position
    for (let i = 0; i < schedule.positions.length; i++) {
      const position = schedule.positions[i];
      const td = document.createElement("td");
      td.textContent = row.assignments[position];

      if (position.startsWith("Break")) {
        td.classList.add("break");
      }

      tr.appendChild(td);
    }

    table.appendChild(tr);
  }

  // ----- Put it on the page -----
  const output = document.getElementById("output");
  output.innerHTML = "";        // clear the old table
  output.appendChild(table);    // add the new one
}


function build() {
  const errorBox = document.getElementById("error");
  errorBox.textContent = "";   // clear any old error

  // Read the form
  const guards = lines(document.getElementById("guards").value);
  const stations = lines(document.getElementById("stations").value);
  const start = document.getElementById("start").value;
  const end = document.getElementById("end").value;
  const interval = Number(document.getElementById("interval").value);

  try {
    const schedule = buildSchedule(guards, stations, start, end, interval);
    render(schedule);
    saveSettings();
  } catch (err) {
    errorBox.textContent = err.message;   // show the error on the page
  }
}

function saveSettings() {
  const data = {
    guards: document.getElementById("guards").value,
    stations: document.getElementById("stations").value,
    start: document.getElementById("start").value,
    end: document.getElementById("end").value,
    interval: document.getElementById("interval").value
  };

  try {
    localStorage.setItem("lifeguard-settings", JSON.stringify(data));
  } catch (err) {
    // storage is blocked in this browser; the app still works
  }
}

function loadSettings() {
  try {
    const saved = localStorage.getItem("lifeguard-settings");
    if (saved === null) {
      return;   // nothing saved yet, keep the default values
    }

    const data = JSON.parse(saved);
    document.getElementById("guards").value = data.guards;
    document.getElementById("stations").value = data.stations;
    document.getElementById("start").value = data.start;
    document.getElementById("end").value = data.end;
    document.getElementById("interval").value = data.interval;
  } catch (err) {
    // storage blocked or saved data is broken; keep the defaults
  }
}

function printPage() {
  window.print();
}

document.getElementById("build").addEventListener("click", build);
document.getElementById("print").addEventListener("click", printPage);

loadSettings();   // fill the form with the last setup
build();          // show a schedule right away
