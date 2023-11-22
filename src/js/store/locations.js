import { api } from "../services/apiService";
import { formatDate } from '../helpers/date';
import{currencyUI} from '../views/currency';

class Locations {
  constructor(api, helpers) {
    this.api = api;
    this.countries = null;
    this.cities = null;
    this.shortCitiesList = null;
    this.airlines = null;
    this.lastSearch = null;
    this.formatDate = helpers.formatDate;
    this._favorites = {};
    this.getCurrencyValue = helpers.currencyUI.getCurrencyValue.bind(helpers.currencyUI);
  }

  async init() {
    const response = await Promise.all([
      this.api.countries(),
      this.api.cities(),
      this.api.airlines()
    ]);

    const [countries, cities, airlines] = response;
    this.countries = this.serializeCountries(countries);
    this.cities = this.serializeCities(cities);
    this.shortCitiesList = this.createShortCitiesList(this.cities);
    this.airlines = this.serializeAirlines(airlines);
    return response;
  }

  serializeCountries(countries) {
    // {'Country code': {country}}
    return countries.reduce((acc, country) => {
      acc[country.code] = country;
      return acc;
    }, {})
  }

  serializeCities(cities) {
    // {'City name, Country Name': {city}}
    return cities.reduce((acc, city) => {
      const countryName = city.country_code;
      const cityName = city.name || city.name_translations.en;
      const fullName = `${cityName},${countryName}`;

      acc[city.code] = { ...city, countryName, cityName, fullName };
      return acc;
    }, {})
  }

  serializeAirlines(airlines) {
    return airlines.reduce((acc, company) => {
      company.logo = `http://pics.avs.io/200/200/${company.code}.png`;
      company.name = company.name || company.name_translations.en
      acc[company.code] = company;
      return acc;
    }, {})
  }

  serializeTickets(tickets) {
    return Object.values(tickets)
      .map(ticket => ({
        ...ticket,
        originName: this.getCityNameByCode(ticket.origin),
        destinationName: this.getCityNameByCode(ticket.destination),
        airlineLogo: this.getAirlineLogoByCode(ticket.airline),
        airlineName: this.getAirlineNameByCode(ticket.airline),
        departureAt: this.formatDate(ticket.departure_at, 'dd MMM yyyy hh:mm'),
        returnAt: this.formatDate(ticket.return_at, 'dd MMM yyyy hh:mm'),
        virtualId: `${ticket.flight_number}-${ticket.departure_at}-${ticket.airline}-${ticket.origin}-${ticket.price}`
      }))
  }

  createShortCitiesList(cities) {
    // {'City name, Country Name': null}
    return Object.values(cities).reduce((acc, city) => {
      acc[city.fullName] = null;
      return acc;
    }, {})
  }

  getCityCodeByKey(key) {
    const city = Object.values(this.cities).find(({ fullName }) => fullName === key);
    return city.code;
  }

  getCityNameByCode(code) {
    return this.cities[code].name;
  }

  getCountryNameByCityCode(code) {
    return this.countries[code].name
  }

  getAirlineNameByCode(code) {
    return this.airlines[code] ? this.airlines[code].name : '';
  }

  getAirlineLogoByCode(code) {
    return this.airlines[code] ? this.airlines[code].logo : '';
  }


  async fetchTickets(params) {
    const response = await this.api.prices(params);
    this.lastSearch = this.serializeTickets(response.data);
  }

  get favorites(){
    return this._favorites;
  }

  isTicketFavorite(virtualId){
    return this._favorites && this._favorites[virtualId];
  }

  getTicketByVirtualId(virtualId){
    return this.lastSearch.find(ticket => virtualId === ticket.virtualId);
  }

  addToFavorites(virtualId){
    const ticket = this.getTicketByVirtualId(virtualId);

    this._favorites[virtualId] = JSON.parse(
      JSON.stringify({...ticket, currency: this.getCurrencyValue()})
    )

    return this._favorites[ticket.virtualId];
  }

  removeFromFavorite(virtualId){
    delete this._favorites[virtualId]
  }

  emptyFavoriteList(){
    !Object.keys(this._favorites).length
  }
}

export const locations = new Locations(api, { formatDate, currencyUI });
