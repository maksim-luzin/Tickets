import 'materialize-css/dist/css/materialize.min.css';
import 'materialize-css/dist/js/materialize.min.js';

//init select
const select = document.querySelectorAll('select');
M.FormSelect.init(select);

export const getSelectInstance = (elem) => (
  M.FormSelect.getInstance(elem)
)

//init autocomplete
const autocomplete = document.querySelectorAll('.autocomplete');
M.Autocomplete.init(autocomplete);


export const getAutocompleteInstance = (elem) => (
  M.Autocomplete.getInstance(elem)
)

//init datepickers
const datepickers = document.querySelectorAll('.datepicker');
M.Datepicker
  .init(datepickers, {
    showClearButton: true,
    format: 'yyyy-mm'
  });

export const getDatepickerInstance = (elem) => (
  M.Datepicker.getInstance(elem)
)

const dropdown = document.querySelectorAll('.dropdown-trigger');
M.Dropdown.init(dropdown, { closeOnClick: false });
