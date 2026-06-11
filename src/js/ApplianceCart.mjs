import { getLocalStorage, setLocalStorage, qs } from "./utils.mjs";

export default class ApplianceCart {
  constructor(storageKey, outputTableBodySelector) {
    this.storageKey = storageKey;
    this.outputBody = qs(outputTableBodySelector);
  }

  init() {
    this.renderLoadTable();
  }

  addAppliance(name, qty, watts, hours) {
    const currentList = getLocalStorage(this.storageKey);

    const newEntry = {
      id: "app_" + Date.now().toString(),
      name,
      quantity: parseInt(qty),
      watts: parseFloat(watts),
      hours: parseFloat(hours),
      totalWh: parseInt(qty) * parseFloat(watts) * parseFloat(hours),
    };

    currentList.push(newEntry);
    setLocalStorage(this.storageKey, currentList);
    this.renderLoadTable();
  }

  removeAppliance(id) {
    let currentList = getLocalStorage(this.storageKey);
    currentList = currentList.filter((item) => item.id !== id);
    setLocalStorage(this.storageKey, currentList);
    this.renderLoadTable();
  }

  // Returns single table row markup using dynamic template injection literal strategies
  applianceRowTemplate(item) {
    return `
      <tr>
        <td>${item.name}</td>
        <td>${item.quantity}</td>
        <td>${item.watts} W</td>
        <td>${item.hours} hrs</td>
        <td>${item.totalWh.toLocaleString()} Wh/day</td>
        <td><button class="delete-btn" data-id="${item.id}">❌ Remove</button></td>
      </tr>
    `;
  }

  renderLoadTable() {
    const items = getLocalStorage(this.storageKey);
    this.outputBody.innerHTML = "";

    if (items.length === 0) {
      this.outputBody.innerHTML = `
        <tr>
          <td colspan="6" class="table-placeholder">No appliances added yet. Build your system load profile above!</td>
        </tr>`;
      return;
    }

    // Loop array listings injecting child element components cleanly into target hooks
    const htmlRows = items
      .map((item) => this.applianceRowTemplate(item))
      .join("");
    this.outputBody.innerHTML = htmlRows;
  }
}
