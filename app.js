let startTime;
let intervalId;
let restIntervalId;
let logged = false;
const logField = document.getElementById("log");
const logList = document.getElementById("logList");
const task = document.getElementById("taskName");
const restMessage = document.getElementById("restMessage");
const logging = document.getElementById("logging");
const stop = document.getElementById("stop");
let restCounter = 20000 * 60;
let restInterval = 20000 * 60;
let ten = 10000 * 60;
let twenty = 20000 * 60;

function startTracking() {
  const taskName = task.value;
  logging.style.visibility = "visible";
  if (!taskName) {
    alert("Please enter a task name.");
    return;
  }

  startTime = Date.now();
  intervalId = setInterval(updateTimer, 1000); // Update the timer every second
  restIntervalId = setInterval(startRestTimer, ten);
  restMessage.style.display = "block";
  restMessage.innerText = `Break time in 30 minutes`;
  stop.style.display = "block";

  addBeforeUnloadWarning()
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
  clearInterval(restIntervalId);
  const endTime = Date.now();
  const elapsedTime = (endTime - startTime) / 1000; // in seconds
  const taskName = document.getElementById("taskName").value;

  // Save the task in localStorage
  const timeLog = JSON.parse(localStorage.getItem("timeLog")) || [];
  timeLog.push({ taskName, elapsedTime });
  localStorage.setItem("timeLog", JSON.stringify(timeLog));

  startTime = null;
  document.getElementById("taskName").value = " ";

  displayTimeLog();
  logging.style.visibility = "hidden";
  stop.style.display = "none";
  restMessage.style.display = "none";

  removeBeforeUnloadWarning();
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
  logging.innerHTML = capitalizeFirstLetter(
    `Now tracking ${task.value}: ${formattedTime}`
  );
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
    listItem.innerHTML = capitalizeFirstLetter(
      `<span class="task">Task:</span> ${entry.taskName}, <span class="task">Time spent:</span> ${formatTime(entry.elapsedTime)}`
    );
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
    alert("No logs to clear. Use the start button to track your activities");
    return;
  }
  logList.innerHTML = "";
  localStorage.removeItem("timeLog");
  logField.style.display = "none";
}


function startRestTimer() {
  if (restCounter === 0) {
    restMessage.style.display = "block";
    restMessage.textContent = "Time to rest. Please take a 5 minutes break";
    clearInterval(restIntervalId);
    setTimeout(() => {
      restMessage.textContent = "Resting time remain 2 minutes";
    }, 3000 * 60);

    setTimeout(() => {
      restMessage.textContent = "Your are now refreshed.";
    }, 4000 * 60);

    setTimeout(() => {
      restIntervalId = setInterval(startRestTimer, ten);
    }, 5000 * 60);
    return;
  } else if (restCounter === ten) {
    restMessage.innerText = `Break time is in 10 minutes`;
  } else if (restCounter === twenty) {
    restMessage.innerText = `Break time is in 20 minutes`;
  }
  restCounter -= ten;
}

function updateRestMessage() {
  if (restCounter === 0) {
    restMessage.style.display = "block";
    restMessage.textContent = "Time to Rest!";
    restCounter = 30 * 60;
  } else if (restCounter <= restInterval) {
    restMessage.style.display = "block";
    restMessage.innerText = `Rest in ${restTime.toFixed(2)} minutes`;
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


function addBeforeUnloadWarning() {
    // Add the beforeunload event listener
    window.addEventListener('beforeunload', beforeUnloadHandler);
}

function removeBeforeUnloadWarning() {
    // Remove the beforeunload event listener
    window.removeEventListener('beforeunload', beforeUnloadHandler);
}

function beforeUnloadHandler(e) {
    e.preventDefault();
    e.returnValue = 'You have unsaved changes. Are you sure you want to leave this page?';
}
