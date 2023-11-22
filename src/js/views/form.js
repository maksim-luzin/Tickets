import { getAutocompleteInstance, getDatepickerInstance } from '../plugins/materialize';

class FormUI {
  constructor(autocompleteInstance, datepickerInstance) {
    // Elements
    this._form = document.forms.locationControls;
    this.origin = document.getElementById('autocomplete-origin');
    this.destination = document.getElementById('autocomplete-destination');
    this.depart = document.getElementById('datepicker-depart');
    this.return = document.getElementById('datepicker-return');

    // Material instances
    this.originAutocomplete = autocompleteInstance(this.origin);
    this.destinationAutocomplete = autocompleteInstance(this.destination);
    this.departDatepicker = datepickerInstance(this.depart);
    this.returnDatepicker = datepickerInstance(this.return);
  }

  get form() {
    return this._form;
  }

  setAutocompleteData(data) {
    this.originAutocomplete.updateData(data);
    this.destinationAutocomplete.updateData(data);
  }

  get originValue() {
    return this.origin.value;
  }

  get destinationValue() {
    return this.destination.value;
  }

  get departDateValue() {
    return this.departDatepicker.toString();
  }

  get returnDateValue() {
    return this.returnDatepicker.toString();
  }
}

export const formUI = new FormUI(getAutocompleteInstance, getDatepickerInstance);
