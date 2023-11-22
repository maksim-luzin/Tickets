import { currencyUI } from './currency';

class FavoritesUI {
  constructor() {
    this.container = document.querySelector('.dropdown-content');
    this.isContainerEmpty = true;
  }

  get favorites(){
    return this.container;
  }

  getFavoriteByVirtualId(virtualId){
    return this.container.querySelector(`[data-virtual-id="${virtualId}"]`)
  }

  addFavorite(favorite) {

    if (this.isContainerEmpty) {
      this.clearContainer();
      this.isContainerEmpty = false;
    }

    const fragment = FavoritesUI.favoriteTemplate(favorite);

    this.container.insertAdjacentHTML('afterbegin', fragment);
  }

  removeFavorite(virtualId) {
    const elementForRemove = this.getFavoriteByVirtualId(virtualId);

    if(!elementForRemove) return;
    elementForRemove.remove();
  }

  clearContainer() {
    this.container.innerHTML = '';
  }

  showEmptyMessage() {
    const template = FavoritesUI.emptyMessageTemplate();
    this.container.insertAdjacentHTML('afterbegin', template);
  }

  getElementByClick(target){
    const favoriteElement = target.closest('.relative');
    if(!favoriteElement) return null;
    const virtualId = favoriteElement.dataset?.virtualId;
    if(!virtualId) return null;

    return virtualId;
  }

  static emptyMessageTemplate() {
    return `
      <div class="favorites-empty-res-msg">
        Избранные билеты отсутствуют.
      </div>
    `
  }

  static favoriteTemplate(favorite) {
    return `
      <div class="favorite-item  d-flex align-items-start relative pointer unselectable" data-virtual-id="${favorite.virtualId}">
        <img
          src="${favorite.airlineLogo}"
          class="favorite-item-airline-img"
        />
        <div class="favorite-item-info d-flex flex-column">
          <div
            class="favorite-item-destination d-flex align-items-center"
          >
            <div class="d-flex align-items-center mr-auto">
              <span class="favorite-item-city">${favorite.originName}</span>
              <i class="medium material-icons">flight_takeoff</i>
            </div>
            <div class="d-flex align-items-center">
              <i class="medium material-icons">flight_land</i>
              <span class="favorite-item-city">${favorite.destinationName}</span>
            </div>
          </div>
          <div class="favorite-time-price d-flex align-items-center">
            <span class="favorite-time-departure">${favorite.departureAt}</span>
            <span class="favorite-price ml-auto">${favorite.currency}${favorite.price}</span>
          </div>
          <div class="favorite-additional-info">
            <span class="favorite-transfers">${favorite.transfers}</span>
            <span class="favorite-flight-number">${favorite.flight_number}</span>
          </div>
          <i class="material-icons favorite">favorite</i>
        </div>
      </div>
    `
  }
}

export const favoritesUI = new FavoritesUI(currencyUI);
