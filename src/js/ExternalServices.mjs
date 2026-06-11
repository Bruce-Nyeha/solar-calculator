// src/js/ExternalServices.mjs

export default class ExternalServices {
  constructor() {
    this.cityMap = {
      accra: { lat: 5.6037, lon: -0.1870 },
      kumasi: { lat: 6.6961, lon: -1.6141 },
      tamale: { lat: 9.4034, lon: -0.8396 },
      takoradi: { lat: 4.9016, lon: -1.7779 },
      koforidua: { lat: 6.0945, lon: -0.2591 },
      cape_coast: { lat: 5.1053, lon: -1.2466 }
    };
  }

  async getPeakSunHours(cityKey) {
    const coords = this.cityMap[cityKey.toLowerCase()];
    if (!coords) throw new Error(`Unknown city: ${cityKey}`);

    // FIXED: Added full API endpoint route path and proper template literal dollar signs ($)
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&daily=shortwave_radiation_sum&timezone=auto`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Weather service status error.");
      const data = await response.json();
      
      const radiationArray = data.daily.shortwave_radiation_sum;
      if (!radiationArray || radiationArray.length === 0) return 4.5;

      const totalKwh = radiationArray.reduce((sum, value) => sum + (value * 0.277778), 0);
      const averageDailyPsh = totalKwh / radiationArray.length;
      
      return Number(averageDailyPsh.toFixed(2));
    } catch (error) {
      console.warn("Weather fallback activated:", error);
      return 4.5;
    }
  }

  async getLiveExchangeRate() {
    const apiKey = import.meta.env.VITE_EXCHANGE_RATE_API_KEY;
    
    if (!apiKey) {
      console.warn("API Key configuration error inside .env profile layout mapping.");
      return 15.25;
    }

    // FIXED: Restored full secure subdomain path and template literal dollar sign interpolation ($)
    const url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Secure ExchangeRate-API connection failure.");
      const data = await response.json();
      
      return Number(data.conversion_rates.GHS.toFixed(2));
    } catch (error) {
      console.warn("Currency fallback activated due to secure verification blocks:", error);
      return 15.25; 
    }
  }
}
