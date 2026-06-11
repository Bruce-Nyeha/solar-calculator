// src/js/main.js
import { loadHeaderFooter, qs } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";
import ApplianceCart from "./ApplianceCart.mjs";

// Centralizing system operational configurations
const SERVICES_API = new ExternalServices();
const SYSTEM_CART = new ApplianceCart("sollichtrise-cart", "#load-list-body");

let systemState = {
  peakSunHours: null,
  exchangeRate: null,
  currencyDisplay: "USD", // Default baseline toggle position
};

/**
 * Updates the screen metrics dynamically based on the selected currency tier
 */
function updateCurrencyDisplay() {
  const displayRateElement = qs("#display-rate");
  if (!systemState.exchangeRate) return;

  if (systemState.currencyDisplay === "GHS") {
    // Converts the default USD baseline value over into live Ghana Cedis text format
    displayRateElement.textContent = `${systemState.exchangeRate} GH₵`;
  } else {
    // Keeps standard base tracking text
    displayRateElement.textContent = `$1.00 USD`;
  }
}

/**
 * Handles concurrent API fetch operations matching Week 6 criteria
 */
async function syncRegionalMetrics(cityKey) {
  if (!cityKey) return;

  // Set explicit temporary processing indicators into user-facing tags
  qs("#display-psh").textContent = "Syncing...";
  qs("#display-rate").textContent = "Syncing...";

  try {
    // Concurrent thread execution pattern ensuring optimized platform delivery speeds
    const [psh, rate] = await Promise.all([
      SERVICES_API.getPeakSunHours(cityKey),
      SERVICES_API.getLiveExchangeRate(),
    ]);

    systemState.peakSunHours = psh;
    systemState.exchangeRate = rate;

    // Direct interface data updates
    qs("#display-psh").textContent = `${psh} hrs/day`;

    // Trigger currency recalculation view refresh
    updateCurrencyDisplay();
  } catch (err) {
    console.error("System synchronization operational failure:", err);
  }
}

// --- Wire Up Application Forms and Listeners ---
function setupAppListeners() {
  // Location Event Controls
  qs("#city-select").addEventListener("change", (e) => {
    syncRegionalMetrics(e.target.value);
  });

  // Actively refreshes the active screen metric card text when the dropdown changes
  qs("#currency-toggle").addEventListener("change", (e) => {
    systemState.currencyDisplay = e.target.value;
    updateCurrencyDisplay(); // Forces layout recalculation row refresh instantly!
  });

  // Appliance Submission Control
  qs("#appliance-form").addEventListener("submit", (e) => {
    e.preventDefault();

    const name = qs("#appliance-name").value;
    const qty = qs("#appliance-qty").value;
    const watts = qs("#appliance-watts").value;
    const hours = qs("#appliance-hours").value;

    SYSTEM_CART.addAppliance(name, qty, watts, hours);
    qs("#appliance-form").reset();
  });

  // Event bubbling listener targeting row removals inside table components
  qs("#load-list-body").addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-btn")) {
      const targetId = e.target.getAttribute("data-id");
      SYSTEM_CART.removeAppliance(targetId);
    }
  });
}

// --- Bootstrap Execution Entry Initialization Hook ---
document.addEventListener("DOMContentLoaded", async () => {
  // Asynchronously inject header and footer layout frameworks
  await loadHeaderFooter();

  // Start data components
  SYSTEM_CART.init();

  // Attach event monitoring pipelines
  setupAppListeners();
});
