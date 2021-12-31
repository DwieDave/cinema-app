import Handlebars from 'handlebars/dist/handlebars';

export default class AbstractPage {
  constructor (params) {
    this.params = params;
  }

  async render () { return ''; }

  clickHandler () { return null; }

  registerClickHandler (querySelector, callback) {
    document.querySelector(querySelector).addEventListener('click', function (event) {
      callback(event);
    });
  }

  renderHandleBars (templateSource, data) {
    const template = Handlebars.compile(templateSource);
    return template(data);
  }

  getValue (querySelector) {
    return (document.querySelector(querySelector)?.value || null);
  }
}
