class CurrencyUI {
  constructor() {
    this.currency = document.getElementById('currency');
    this.dictionary = {
      USD: '$',
      EUR: '€'
    }
  }

  getCurrencyValue() {
    return this.currency.value;
  }

  getCurrencySymbol() {
    return this.dictionary[this.getCurrencyValue()];
  }
}

export const currencyUI = new CurrencyUI();
