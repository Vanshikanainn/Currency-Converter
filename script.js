const BASE_URL = "https://api.exchangerate.host/latest";

const dropdowns = document.querySelectorAll("select[name='from'], select[name='to']");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector("select[name='from']");
const toCurr = document.querySelector("select[name='to']");
const msg = document.querySelector("#msg");

for (let select of dropdowns) {
  for (currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = "selected";
    }
    select.append(newOption);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

const updateExchangeRate = async () => {
  let amount = document.querySelector("#amount");
  let amtVal = amount.value;
  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amount.value = "1";
  }
  const URL = `${BASE_URL}?base=${fromCurr.value}&symbols=${toCurr.value}`;
  try {
    let response = await fetch(URL);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    let data = await response.json();
    let rate = data.rates[toCurr.value];
    if (!rate) {
      throw new Error("Invalid currency code");
    }
    let finalAmount = amtVal * rate;
    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount.toFixed(2)} ${toCurr.value}`;
  } catch (error) {
    msg.innerText = "Failed to fetch exchange rate. Please try again later.";
    console.error("Error fetching exchange rate:", error);
  }
};

const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

window.addEventListener("load", () => {
  updateExchangeRate();
});

// New features
const sections = ['header', 'about', 'converter'];
let currentSection = 0;

document.getElementById('scrollUp').addEventListener('click', () => {
  if (currentSection > 0) {
    currentSection--;
    document.getElementById(sections[currentSection]).scrollIntoView({ behavior: 'smooth' });
  }
});

document.getElementById('scrollDown').addEventListener('click', () => {
  if (currentSection < sections.length - 1) {
    currentSection++;
    document.getElementById(sections[currentSection]).scrollIntoView({ behavior: 'smooth' });
  }
});

document.querySelectorAll('[data-filter]').forEach(item => {
  item.addEventListener('click', e => {
    e.preventDefault();
    const filter = e.target.getAttribute('data-filter');
    applyFilter(filter);
  });
});

function applyFilter(filter) {
  const body = document.body;
  body.className = body.className.replace(/filter-\w+/g, '');
  if (filter !== 'normal') {
    body.classList.add(`filter-${filter}`);
  }
}

document.getElementById('voiceNav').addEventListener('click', () => {
  const utterance = new SpeechSynthesisUtterance('Voice navigation activated. Use arrow buttons for navigation.');
  speechSynthesis.speak(utterance);
});

document.getElementById('textToSpeech').addEventListener('click', () => {
  const text = document.getElementById('msg').textContent;
  const utterance = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(utterance);
});

document.getElementById('objectScanning').addEventListener('click', () => {
  alert('Object scanning feature coming soon.');
});

document.getElementById('profile').addEventListener('click', () => {
  alert('Profile feature coming soon.');
});
