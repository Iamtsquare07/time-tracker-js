let startTime;
let intervalId;
let logged = false;
const logField = document.getElementById("log");
const logList = document.getElementById("logList");
const task = document.getElementById("taskName");
const restMessage = document.getElementById("restMessage");
const logging = document.getElementById('logging')
const stop = document.getElementById('stop');
let restCounter = 30 * 60; // 30 minutes in seconds
let restInterval = 10 * 60; // 10 minutes in seconds

function startTracking() {
  const taskName = task.value;
  logging.style.visibility = "visible";
  if (!taskName) {
    alert("Please enter a task name.");
    return;
  }

  startTime = Date.now();
  intervalId = setInterval(updateTimer, 1000);

  // Display the initial rest message
  updateRestMessage();

  // Start the rest timer
  startRestTimer();
  stop.style.display = 'block';
}

task.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    startTracking();
  }
});

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

  startTime = null;
  document.getElementById("taskName").value = "";

  displayTimeLog()
  logging.style.visibility = "hidden";
  stop.style.display = 'none';
}

function updateTimer() {
  const currentTime = Date.now();
  const elapsedMilliseconds = currentTime - startTime;
  const hours = Math.floor(elapsedMilliseconds / 3600000);
  const minutes = Math.floor((elapsedMilliseconds % 3600000) / 60000);
  const seconds = ((elapsedMilliseconds % 3600000) % 60000) / 1000;

  const formattedTime = `${hours} hours, ${minutes} minutes, ${seconds.toFixed(
    0
  )} seconds`;
  logging.innerHTML = capitalizeFirstLetter(`Now tracking ${task.value}: ${formattedTime}`);
}

function displayTimeLog() {
  logList.innerHTML = "";
  logged = true;
  const timeLog = JSON.parse(localStorage.getItem("timeLog")) || [];

  if (!timeLog.length) {
    return;
  }

  timeLog.forEach((entry, index) => {
    const listItem = document.createElement("li");
    listItem.innerText = capitalizeFirstLetter(`Task: ${entry.taskName}, Time spent: ${formatTime(entry.elapsedTime)}`);
    logList.appendChild(listItem);
  });

  logField.style.display = "block";
}

function formatTime(timeInSeconds) {
  if (timeInSeconds >= 3600) {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${hours} hours, ${minutes} minutes, ${seconds} seconds`;
  } else if (timeInSeconds >= 60) {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes} minutes, ${seconds} seconds`;
  } else {
    return `${timeInSeconds} seconds`;
  }
}


function clearLogs() {
  if (!logged) {
    alert("No logs to clear");
    return;
  }
  logList.innerHTML = "";
  localStorage.removeItem("timeLog");
  logField.style.display = "none";
}

function startRestTimer() {
  setInterval(() => {
    if (restCounter === 0) {
      restMessage.style.display = "block";
      restMessage.textContent = "Time to Rest!";
      restCounter = 30 * 60;
      return;
    } else if (restCounter <= restInterval) {
      restMessage.style.display = "block";
      restMessage.innerText = `Rest in ${restCounter / 60} minutes`;
    }
    restCounter--;
  }, 1000);
}

function updateRestMessage() {
  if (restCounter === 0) {
    restMessage.style.display = "block";
    restMessage.textContent = "Time to Rest!";
    restCounter = 30 * 60;
  } else if (restCounter <= restInterval) {
    restMessage.style.display = "block";
    restMessage.innerText = `Rest in ${restCounter / 60} minutes`;
  }
}

displayTimeLog();

function capitalizeFirstLetter(text) {
  // Split the string into words
  const words = text.split(" ");

  // Capitalize the first letter of each word
  const capitalizedWords = words.map((word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  });

  // Join the capitalized words back together
  return capitalizedWords.join(" ");
}