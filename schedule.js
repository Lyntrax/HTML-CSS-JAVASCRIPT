const START_HOUR = 7;
    const END_HOUR   = 21;
    const days = ["Time","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
    const classes = [
    { day: "Monday",    start: "13:00", end: "18:00", title: "IT-PF01", room: "ComLab 4" },
    { day: "Tuesday",   start: "13:00", end: "18:00", title: "CC-103", room: "ComLab 2" },
    { day: "Wednesday", start: "18:00", end: "21:00", title: "ITE-MS01", room: "SHS A Room 17" },
    { day: "Thursday",  start: "18:00", end: "21:00", title: "GE7", room: "SHS Room 16" },
    { day: "Saturday",  start: "07:00", end: "12:00", title: "IT-NET01", room: "SHS B Room 39" },
    { day: "Saturday",  start: "18:00", end: "20:00", title: "PATHFIT 3", room: "SHS Umali Gym" },
    { day: "Sunday",    start: "09:00", end: "12:00", title: "FIL 1", room: "SHS B Room 34" },
  ];



    const colorMap = {
    "ITE-MS01": "s-ite-ms01",
    "PATHFIT 3": "s-pathfit-3",
    "CC-103": "s-cc-103",
    "GE7": "s-ge7",
    "IT-PF01": "s-it-pf01",
    "FIL 1": "s-fil1",
    "IT-NET01": "s-it-net01"
  };


    const grid = document.getElementById("grid");
    days.forEach((d,i) => {
      const c = document.createElement("div");
      c.className = "cell head";
      c.textContent = d;
      c.style.gridColumn = `${i+1} / ${i+2}`;
      c.style.gridRow = "1 / 2";
      grid.appendChild(c);
    });
    for(let r=START_HOUR; r<END_HOUR; r++){
      const row = (r-START_HOUR)+2;
      const tcell = document.createElement("div");
      tcell.className = "cell time";
      tcell.style.gridColumn = "1 / 2";
      tcell.style.gridRow = `${row} / ${row+1}`;
      tcell.dataset.hour = r;
      grid.appendChild(tcell);
      for(let c=2; c<=8; c++){
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.style.gridColumn = `${c} / ${c+1}`;
        cell.style.gridRow = `${row} / ${row+1}`;
        grid.appendChild(cell);
      }
    }
    const toMinutes = hhmm => {
      const [h,m] = hhmm.split(":").map(Number);
      return h*60 + (m||0);
    };
    const rowFromTime = (hhmm) => {
      const mins = toMinutes(hhmm);
      const base = START_HOUR*60;
      const slot = Math.max(0, Math.min((END_HOUR-START_HOUR)*60, mins - base));
      return Math.floor(slot/60) + 2;
    };
    const rowsSpan = (start,end) => Math.max(1, Math.ceil((toMinutes(end)-toMinutes(start))/60));
    const formatTime12 = mins => {
      let h = Math.floor(mins/60), m = mins%60;
      const ampm = h>=12 ? "PM":"AM";
      h = ((h+11)%12)+1;
      return `${h}:${m.toString().padStart(2,'0')} ${ampm}`;
    };
    const formatHourLabel = (hour, is24) => {
      if(is24) return `${hour.toString().padStart(2,'0')}:00`;
      const m = hour*60;
      return formatTime12(m).replace(':00','');
    };
    let is24Hour = false;
    const renderHourLabels = () => {
  document.querySelectorAll(".cell.time").forEach(el => {
    const h = Number(el.dataset.hour);
    el.textContent = `${formatHourLabel(h,is24Hour)}-${formatHourLabel(h+1,is24Hour)}`;
  });

  
  if (window.innerWidth <= 600) {
    document.querySelectorAll(".cell.time").forEach(el => {
      el.style.fontSize = is24Hour ? "12px" : "11px";
    });
  }
};

    classes.forEach(evt=>{
      const col = days.indexOf(evt.day)+1;
      const startRow = rowFromTime(evt.start);
      const span = rowsSpan(evt.start, evt.end);
      const block = document.createElement("div");
      block.className = `event ${colorMap[evt.title]}`;
      block.style.gridColumn = `${col} / ${col+1}`;
      block.style.gridRow = `${startRow} / ${startRow + span}`;
      block.innerHTML = `<div class="title">${evt.title}</div>${evt.room ? `<div class="meta">${evt.room}</div>` : ""}`;
      grid.appendChild(block);
    });
    document.getElementById("toggleTime").addEventListener("click", (e)=>{
      is24Hour = !is24Hour;
      e.target.textContent = is24Hour ? "Switch to 12-hour" : "Switch to 24-hour";
      renderHourLabels();
    });
    document.getElementById("toggleTheme").addEventListener("click", (e)=>{
      document.documentElement.classList.toggle("dark");
      e.target.textContent =
        document.documentElement.classList.contains("dark") ? "Light mode" : "Dark mode";
    });
    renderHourLabels();
