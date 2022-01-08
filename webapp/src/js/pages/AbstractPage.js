const Handlebars = require('handlebars');
const axios = require('axios');
const UIkit = require('uikit');

/*  AbstractPage: Parent-Class for all pages.
    Defines function names and offers common functions */
module.exports = class AbstractPage {
  constructor (params) {
    this.apiURL = 'http://localhost:8080/v1';
    this.params = params;

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

  /* UIKit Functions */

  toast (message, status) {
    UIkit.notification(message, status || 'primary');
  }

  openModal (selector) {
    console.log(UIkit.modal);
    const modal = UIkit.modal(selector);
    if (modal) modal.show();
  }

  /* HELPER FUNCTIONS */

  isValid (value) {
    return value !== undefined && value !== null;
  }

  isFilled (value) {
    return this.isValid(value) && value !== '';
  }

  formatDate (dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: '2-digit', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return date.toLocaleDateString('de-DE', options);
  }

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
