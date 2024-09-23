const BASE_URL = "https://api.exchangerate-api.com/v4/latest"; // New API URL

const dropdowns = document.querySelectorAll(".dropdown select");
const button = document.querySelector("button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// Adding all countries to dropdown
for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;

    // To select USD and INR as default
    if (select.name === "From" && currCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "To" && currCode === "INR") {
      newOption.selected = "selected";
    }
    select.append(newOption);
  }
  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

// Function to update flags as we change countries
const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

// Function to update exchange rate
const updateexchangerate = async () => {
  let amount = document.querySelector(".amount input");
  let amtval = amount.value;

  // Handling edge case
  if (amtval === "" || amtval < 1) {
    amtval = 1;
    amount.value = "1";
  }

  // New API URL using the base URL and from currency
  const URL = `${BASE_URL}/${fromCurr.value}`;

  try {
    let response = await fetch(URL);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    let data = await response.json();

    // Get exchange rate for the selected "to" currency
    let rate = data.rates[toCurr.value];
    console.log(rate);
    let finalAmout = rate * amtval;

    // Display the conversion result
    msg.innerText = `${amtval} ${fromCurr.value} = ${finalAmout.toFixed(2)} ${toCurr.value}`;
  } catch (error) {
    console.error("Error fetching exchange rate:", error);
    msg.innerText = "Error fetching exchange rate. Please try again.";
  }
};

// Add event listener on button for calculation
button.addEventListener("click", async (evt) => {
  console.log("ckicked");
    evt.preventDefault(); // Prevent automatic form submission behavior
  updateexchangerate();
});

// Fetch exchange rate on page load
window.addEventListener("load", (evt) => {
  updateexchangerate();
});
