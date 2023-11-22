import { currencyUI } from './currency';
import {locations } from '../store/locations';

class TicketsUI {
  constructor(currency, location) {
    this.container = document.querySelector('.tickets-sections .row');
    this.currencySymbol = currency.getCurrencySymbol.bind(currency);
    this.isTicketFavorite = locations.isTicketFavorite.bind(locations);
  }

  get tickets(){
    return this.container;
  }

  renderTickets(tickets) {
    this.clearContainer();

    if (!tickets.length) {
      this.showEmptyMessage();
      return;
    }
    const currency = this.currencySymbol();

    const fragment = tickets.reduce((acc, ticket) => {
      const isFavorite = this.isTicketFavorite(ticket.virtualId);
      acc += TicketsUI.ticketTemplate({...ticket, isFavorite}, currency);
      return acc
    }, '')

    this.container.insertAdjacentHTML('afterbegin', fragment);
  }

  clearContainer() {
    this.container.innerHTML = '';
  }

  showEmptyMessage() {
    const template = TicketsUI.showEmptyMessage();
    this.container.insertAdjacentHTML('afterbegin', template);
  }

  getElementByClick(target){
    const ticketElement = target.closest('.relative');
    if(!ticketElement) return null;
    const virtualId = ticketElement.dataset?.virtualId;
    if(!virtualId) return null;

    return { ticketElement, virtualId }
  }

  toggleFavorite(ticketElement){
    const favoritesElements = ticketElement.querySelectorAll('.material-icons.favorite')
    if(!favoritesElements) return;
    favoritesElements.forEach(favoritesElement => favoritesElement.classList.toggle('hide'))
  }

  getTicketElementByVirtualId(virtualId){
    return this.container.querySelector(`[data-virtual-id="${virtualId}"]`)
  }

  static emptyMessageTemplate() {
    return `
      <div class="tickets-empty-res-msg">
        По вашему запросу билетов не найдено.
      </div>
    `
  }

  static ticketTemplate(ticket, currency) {
    return `
      <div class="col s12 m6 relative pointer unselectable" data-virtual-id="${ticket.virtualId}">
        <div class="card ticket-card">
          <div class="ticket-airline d-flex align-items-center">
            <img
              src="${ticket.airlineLogo}"
              class="ticket-airline-img"
            />
            <span class="ticket-airline-name"
              >${ticket.airlineName}</span
            >
          </div>
          <div class="ticket-destination d-flex align-items-center">
            <div class="d-flex align-items-center mr-auto">
              <span class="ticket-city">${ticket.originName}</span>
              <i class="medium material-icons">flight_takeoff</i>
            </div>
            <div class="d-flex align-items-center">
              <i class="medium material-icons">flight_land</i>
              <span class="ticket-city">${ticket.destinationName}</span>
            </div>
          </div>
          <div class="ticket-time-price d-flex align-items-center">
            <span class="ticket-time-departure">${ticket.departureAt}</span>
            <span class="ticket-price ml-auto">${currency}${ticket.price}</span>
          </div>
          <div class="ticket-additional-info">
            <span class="ticket-transfers">${ticket.transfers}</span>
            <span class="ticket-flight-number">${ticket.flight_number}</span>
          </div>
        </div>
        <i class="material-icons favorite ${ticket.isFavorite ? '' : 'hide'}">favorite</i>
        <i class="material-icons favorite ${ticket.isFavorite ? 'hide' : ''}">favorite_border</i>
      </div>
    `
  }
}

export const ticketsUI = new TicketsUI(currencyUI, locations);
