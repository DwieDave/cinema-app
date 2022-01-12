const Handlebars = require('handlebars');
const axios = require('axios');
const UIkit = require('uikit');

/*  AbstractPage: Parent-Class for all pages.
    Defines function names and offers common functions */
module.exports = class AbstractPage {
  constructor (params) {
    this.apiURL = 'http://localhost:8080/v1';
    this.params = params;
    this.formid = '';

    // Pagination
    this.elementsPerPage = 6;
    this.currentPage = 1;
    this.minElements = 3;
    this.elementsPerRow = 3;

    // Helpers for example for comparing two arrows or chaining expressions
    Handlebars.registerHelper({
      eq: (v1, v2) => v1 === v2,
      ne: (v1, v2) => v1 !== v2,
      lt: (v1, v2) => v1 < v2,
      gt: (v1, v2) => v1 > v2,
      lte: (v1, v2) => v1 <= v2,
      gte: (v1, v2) => v1 >= v2,
      and () {
        return Array.prototype.every.call(arguments, Boolean);
      },
      or () {
        return Array.prototype.slice.call(arguments, 0, -1).some(Boolean);
      }
    });
  }

  // Pagination
  addPaginationHandler () {
    if (!this.isValid(this.clickHandler)) this.clickHandler = [];
    this.clickHandler.push({
      querySelector: '.changeToPage, .nextPage, .previousPage',
      callback: (event) => {
        this.changeToPage(event);
        event.preventDefault();
      }
    });
  }

  addPaginationListener () {
    if (!this.isValid(this.eventListener)) this.eventListener = [];
    this.eventListener.push({
      element: window,
      event: 'resize',
      callback: (event) => {
        this.calculateElementsPerPage();
      }
    });
    this.eventListener.push({
      element: window,
      event: 'DOMContentLoaded',
      callback: (event) => {
        this.calculateElementsPerPage();
      }
    });
  }

  changeToPage (event) {
    if (event?.currentTarget?.dataset?.page) this.currentPage = parseInt(event.currentTarget.dataset.page);
    else if (event.currentTarget.classList.value.indexOf('nextPage') !== -1) {
      if (this.currentPage + 1 <= this.pages[this.pages.length - 1]) this.currentPage++;
    } else if (event.currentTarget.classList.value.indexOf('previousPage') !== -1) {
      if (this.currentPage - 1 > 0) this.currentPage--;
    }

    this.saveForm();
    this.router.renderPage({ animation: false });
  }

  calculateElementsPerPage () {
    const oldval = this.elementsPerPage;
    const height = window.innerHeight;
    const heightForGrid = height - this.offset;
    const newAmount = Math.floor(heightForGrid / this.cardHeight) * this.elementsPerRow;
    this.elementsPerPage = newAmount >= this.minElements ? newAmount : this.minElements;
    if (this.elementsPerPage !== oldval) this.currentPage = 1;
    this.saveForm();
    this.router.renderPage({ animation: false });
  }

  calcStartEnd (dbObject) {
    const start = ((this.currentPage - 1) * (this.elementsPerPage));
    const end = (this.currentPage * this.elementsPerPage < dbObject.length) ? (this.currentPage * this.elementsPerPage) : (dbObject.length);
    const displayedPresentations = dbObject.slice(start, end);
    const lastPage = Math.ceil(dbObject.length / this.elementsPerPage);
    this.pages = Array.from(Array(lastPage).keys(), (_, i) => i + 1);
    return displayedPresentations;
  }

  saveForm () {
    if (this.isValid(this.getFormValues(this.formid))) {
      this.form = this.getFormValues(this.formid);
    }
  }

  // render: should return pages rendered HTML as String
  // async to be able to await data from server
  async render () { return ''; }

  // registerClickHandler: finds element based on querySelector and adds a callback on click to it
  registerClickHandler (querySelector, callback) {
    const elements = document.querySelectorAll(querySelector);
    for (const element of elements) {
      if (element) {
        element.addEventListener('click', function (event) {
          callback(event);
        }, true);
      }
    }
  }

  // renderHandleBars: compiles handlebar template and injects data into it
  renderHandleBars (templateSource, data) {
    const template = Handlebars.compile(templateSource);
    return template(data);
  }

  // getValue: gets value from element matched by a given querySelector
  getValue (querySelector) {
    return (document.querySelector(querySelector)?.value || null);
  }

  // ----------------------------------------------

  /*  getFormValues (querySelector):
      Gets all "input", "textarea", "select", etc. - elements within a form (fetched by the querySelector)
      and returns their values in an object like: { name: element.value }
      where name (the key) is represented by the elements name attribute */

  getFormValues (querySelector) {
    const selector = `${querySelector} input, ${querySelector} select, ${querySelector} textarea`;
    const elements = document.querySelectorAll(selector);
    const result = {};
    for (const element of elements) {
      if (element.name && this.isValid(element.value)) result[element.name] = element.value;
    }
    return result;
  }

  /* printContainer: Prints a given container-query-selector */

  printContainer (querySelector, title, width, height) {
    console.log('PRINT');
    const reservationConfirmation = document.querySelector(querySelector);
    const printWindow = window.open('', 'PRINT', `height=${width},width=${height}`);
    const printHTML = `<html>
      <head>
        <title>${title}</title>
      </head>
      <body>
        ${reservationConfirmation.innerHTML}
      </body>
    </html>`;

    printWindow.document.write(printHTML);
    printWindow.document.close(); // necessary for IE >= 10
    printWindow.focus(); // necessary for IE >= 10*/
    printWindow.print();
    printWindow.close();

    return true;
  }

  /*
   * Axios Functions
   */

  /*  async getData (urlpath):
      import axios
      wrap axios get call and return it to await it in the render function
      call: getData('/cinemas') */
  async getData (urlpath) {
    try {
      const response = await axios.get(this.apiURL + urlpath);
      return response?.data || null;
    } catch (error) {
      console.error(error);
      return { error: error };
    }
  }

  /*  async postData (urlpath, data):
      wrap axios post call and return it to await it in the render function
      call: postData('/cinemas', {name: "Kinosaal XY", seatRows: 10, seatsPerRow: 12});
      */

  async postData (urlpath, data) {
    try {
      const response = await axios.post(this.apiURL + urlpath, data);
      return response;
    } catch (error) {
      console.error(error);
      return { error: error };
    }
  }

  /* Pagination functions */

  /*
   * UIKit Functions
   */

  toast (message, status) {
    UIkit.notification(message, status || 'primary');
  }

  openModal (selector) {
    console.log(UIkit.modal);
    const modal = UIkit.modal(selector);
    if (modal) modal.show();
  }

  /*
   * HELPER FUNCTIONS
   */

  /* isValid: checks if a value is not undefined or null */
  isValid (value) {
    return value !== undefined && value !== null;
  }

  /* isFilled: checks if a value is valid and not empty */
  isFilled (value) {
    return this.isValid(value) && value !== '';
  }

  /* formatDate: formats a datestring into german date time format */
  formatDate (dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: '2-digit', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return date.toLocaleDateString('de-DE', options);
  }

  /* clone: clones JSON compatible structures */
  clone (value) {
    if (value.length === undefined && typeof value === 'object') return Object.create(value);
    if (value.length !== undefined && typeof value[0] === 'object') {
      const returnArr = [];
      for (const val of value) {
        returnArr.push(Object.create(val));
      }
      return returnArr;
    }
    return JSON.parse(JSON.stringify(value));
  }
};
