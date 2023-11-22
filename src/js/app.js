
import '../css/style.css';
import './plugins';
import { locations } from './store/locations';
import { formUI } from './views/form';
import { currencyUI } from './views/currency';
import { ticketsUI } from './views/tickets';
import {favoritesUI} from './views/favorites';

document.addEventListener('DOMContentLoaded', () => {
  const initApp = async () => {
    await locations.init();
    formUI.setAutocompleteData(locations.shortCitiesList);
    favoritesUI.showEmptyMessage();
  }

  initApp();

  const form = formUI.form;
  const tickets = ticketsUI.tickets;
  const favorites = favoritesUI.favorites;

  // Handlers
  const onFormSubmit = async e => {
    e.preventDefault();

    //Get data
    const origin = locations.getCityCodeByKey(formUI.originValue);
    const destination = locations.getCityCodeByKey(formUI.destinationValue);
    const departDate = formUI.depart.value;
    const returnDate = formUI.return.value;
    const currency = currencyUI.getCurrencyValue()

    await locations.fetchTickets({
      currency,
      origin,
      destination,
      depart_date: departDate,
      return_date: returnDate,
    })

    ticketsUI.renderTickets(locations.lastSearch);
  }

  const toggleFavorite = ({target})=> {
    const favorite = ticketsUI.getElementByClick(target);
    if(!favorite) return;

    ticketsUI.toggleFavorite(favorite.ticketElement);

    if(!locations.isTicketFavorite(favorite.virtualId)){
      const favoriteInfo = locations.addToFavorites(favorite.virtualId);
      favoritesUI.addFavorite(favoriteInfo);
      return;
    }

    favoritesUI.removeFavorite(favorite.virtualId);
    locations.removeFromFavorite(favorite.virtualId);

    if(locations.emptyFavoriteList()) favoritesUI.showEmptyMessage();
  }

  const removeFavorite = ({target})=> {
    const virtualId = favoritesUI.getElementByClick(target);
    if(!virtualId) return;

    favoritesUI.removeFavorite(virtualId);
    locations.removeFromFavorite(virtualId);

    const ticketElement = ticketsUI.getTicketElementByVirtualId(virtualId)
    if(ticketElement) ticketsUI.toggleFavorite(ticketElement);

    if(locations.emptyFavoriteList()) favoritesUI.showEmptyMessage();
  }

  // Events
  form.addEventListener('submit', onFormSubmit);
  tickets.addEventListener('click',toggleFavorite);
  favorites.addEventListener('click',removeFavorite);
})
