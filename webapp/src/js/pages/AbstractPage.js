import Handlebars from 'handlebars/dist/handlebars';

/*  AbstractPage: Parent-Class for all pages.
    Defines function names and offers common functions */
export default class AbstractPage {
  constructor (params) {
    this.params = params;
  }

  // render: should return pages rendered HTML as String
  // async to be able to await data from server
  async render () { return ''; }

  // registerClickHandler: finds element based on querySelector and adds a callback on click to it
  registerClickHandler (querySelector, callback) {
    const element = document.querySelector(querySelector);
    if (element) {
      element.addEventListener('click', function (event) {
        callback(event);
      });
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
  // TODOS:

  /*  TODO: getFormValues (querySelector):
      Gets all "input", "textarea", "select", etc. - elements within a form (fetched by the querySelector)
      and returns their values in an object like: { name: element.value }
      where name (the key) is represented by the elements name attribute */

  /*  TODO: async getData (urlpath):
      import axios
      wrap axios get call and return it to await it in the render function */

  /*  TODO: async postData (urlpath, data):
      wrap axios post call and return it to await it in the render function */
}
