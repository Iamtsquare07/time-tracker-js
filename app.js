let startTime;
let intervalId;

function startTracking() {
  const taskName = document.getElementById("taskName").value;
  if (!taskName) {
    alert("Please enter a task name.");
    return;
  }

  startTime = Date.now();
  intervalId = setInterval(updateTimer, 1000);
}

function stopTracking() {
  if (!startTime) {
    alert("No task is currently being tracked.");
    return;
  }

  clearInterval(intervalId);
  const endTime = Date.now();
  const elapsedTime = (endTime - startTime) / 1000; // in seconds
  const taskName = document.getElementById("taskName").value;

  // Save the task in localStorage
  const timeLog = JSON.parse(localStorage.getItem("timeLog")) || [];
  timeLog.push({ taskName, elapsedTime });
  localStorage.setItem("timeLog", JSON.stringify(timeLog));

  // Display the time log
  displayTimeLog();

  startTime = null;
  document.getElementById("taskName").value = "";
}

function updateTimer() {
  const currentTime = Date.now();
  const elapsedTime = (currentTime - startTime) / 1000;
  document.getElementById("log").innerHTML = `Tracking: ${elapsedTime.toFixed(
    2
  )} seconds`;
}

function displayTimeLog() {
  const logList = document.getElementById("logList");
  logList.innerHTML = "";

  const timeLog = JSON.parse(localStorage.getItem("timeLog")) || [];

  timeLog.forEach((entry, index) => {
    const listItem = document.createElement("li");
    listItem.innerText = `Task: ${
      entry.taskName
    }, Time: ${entry.elapsedTime.toFixed(2)} seconds`;
    logList.appendChild(listItem);
  });
}

displayTimeLog();
