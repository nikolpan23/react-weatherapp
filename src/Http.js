class Http {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = "https://api.openweathermap.org";
  }

  async getWeather(location) {
    const url = `${this.baseUrl}/data/2.5/weather?units=metric&q=${encodeURIComponent(location)}&appid=${this.apiKey}`;
    return this.get(url);
  }

  async getWeatherByCoords(lat, lon) {
    const url = `${this.baseUrl}/data/2.5/weather?units=metric&lat=${lat}&lon=${lon}&appid=${this.apiKey}`;
    return this.get(url);
  }

  async getLocations(text) {
    const url = `${this.baseUrl}/geo/1.0/direct?q=${encodeURIComponent(text)}&limit=5&appid=${this.apiKey}`;
    return this.get(url);
  }

  async get(url) {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        response.status === 404 ? "Location not found" : "Could not load data"
      );
    }

    return response.json();
  }
}

export default Http;