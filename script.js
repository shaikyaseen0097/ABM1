const modes = {
  normal: {
    name: "NORMAL",
    under: 3.00,
    over: 4.20,
    defaultVoltage: 3.70
  },
  charging: {
    name: "CHARGING",
    under: 3.10,
    over: 4.25,
    defaultVoltage: 4.05
  },
  lowPower: {
    name: "LOW POWER",
    under: 3.20,
    over: 4.10,
    defaultVoltage: 3.45
  },
  fault: {
    name: "FAULT TEST",
    under: 3.55,
    over: 3.85,
    defaultVoltage: 4.00
  }
};

let currentMode = "normal";
let voltage = 3.70;

const $ = (id) => document.getElementById(id);

const voltageMetric = $("voltageMetric");
const thresholdMetric = $("thresholdMetric");
const underThreshold = $("underThreshold");
const overThreshold = $("overThreshold");
const stateMetric = $("stateMetric");
const stateText = $("stateText");
const voltageBar = $("voltageBar");
const coverageBar = $("coverageBar");
const coverageMetric = $("coverageMetric");
const heroMode = $("heroMode");
const heroVoltage = $("heroVoltage");
const slider = $("voltageSlider");
const sliderValue = $("sliderValue");
const modeBadge = $("modeBadge");
const log = $("log");
const transitionStatus = $("transitionStatus");

function addLog(message) {
  const line = document.createElement("div");
  line.className = "log-line";
  const time = new Date().toLocaleTimeString();
  line.textContent = `[${time}] ${message}`;
  log.prepend(line);
}

function getState() {
  const config = modes[currentMode];

  if (voltage < config.under) return "UNDER-VOLTAGE";
  if (voltage > config.over) return "OVER-VOLTAGE";
  return "NORMAL";
}

function updateUI() {
  const config = modes[currentMode];
  const state = getState();

  voltageMetric.textContent = `${voltage.toFixed(2)} V`;
  heroVoltage.textContent = voltage.toFixed(2);
  heroMode.textContent = config.name;
  modeBadge.textContent = config.name;

  thresholdMetric.textContent =
    `${((config.under + config.over) / 2).toFixed(2)} V`;

  underThreshold.textContent = `${config.under.toFixed(2)} V`;
  overThreshold.textContent = `${config.over.toFixed(2)} V`;

  sliderValue.textContent = `${voltage.toFixed(2)} V`;
  slider.value = voltage;

  const normalized = Math.max(0, Math.min(100, ((voltage - 2.5) / 2) * 100));
  voltageBar.style.width = `${normalized}%`;

  stateMetric.textContent = state;
  stateMetric.className = "metric";

  if (state === "NORMAL") {
    stateMetric.classList.add("state-normal");
    stateText.textContent = "Voltage is within the selected operating limits.";
  } else if (state === "UNDER-VOLTAGE") {
    stateMetric.classList.add("state-low");
    stateText.textContent = `Voltage is below the adaptive limit of ${config.under.toFixed(2)} V.`;
  } else {
    stateMetric.classList.add("state-high");
    stateText.textContent = `Voltage is above the adaptive limit of ${config.over.toFixed(2)} V.`;
  }

  const coverage = currentMode === "fault" ? 97 : currentMode === "charging" ? 95 : 92;
  coverageMetric.textContent = `${coverage}%`;
  coverageBar.style.width = `${coverage}%`;

  transitionStatus.textContent = "MONITORED";
  transitionStatus.className = state === "NORMAL" ? "ok" : "warn";
}

document.querySelectorAll(".mode-btn").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".mode-btn").forEach((b) => b.classList.remove("active"));
    button.classList.add("active");

    const newMode = button.dataset.mode;

    if (newMode !== currentMode) {
      currentMode = newMode;
      voltage = modes[currentMode].defaultVoltage;
      addLog(`MODE TRANSITION → ${modes[currentMode].name}`);
      addLog(
        `Adaptive thresholds updated: ${modes[currentMode].under.toFixed(2)} V to ${modes[currentMode].over.toFixed(2)} V`
      );
    }

    updateUI();
  });
});

slider.addEventListener("input", () => {
  voltage = Number(slider.value);
  updateUI();
});

$("simulateBtn").addEventListener("click", () => {
  addLog("Simulation started.");
  const startMode = currentMode;
  let step = 0;

  const timer = setInterval(() => {
    step++;

    const target = modes[startMode].defaultVoltage;
    const variation = Math.sin(step / 2) * 0.18 + (Math.random() - 0.5) * 0.08;
    voltage = Math.max(2.5, Math.min(4.5, target + variation));

    updateUI();

    if (step === 1) addLog(`Input sampled at ${voltage.toFixed(2)} V`);
    if (step === 4) addLog(`Comparator result: ${getState()}`);
    if (step === 7) addLog("Functional coverage scenario executed.");
    if (step === 10) {
      addLog("Constrained-random transition check completed.");
      clearInterval(timer);
    }
  }, 250);
});

$("clearLog").addEventListener("click", () => {
  log.innerHTML = "";
  addLog("Log cleared.");
});

updateUI();
addLog("Dashboard initialized.");
addLog("Adaptive threshold controller ready.");
