const Handlebars = require('handlebars');
const axios = require('axios');

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

  isValid (value) {
    return value !== undefined && value !== null;
  }
};
