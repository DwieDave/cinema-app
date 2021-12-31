const AbstractPage = require('./AbstractPage');

module.exports = class CinemasPage extends AbstractPage {
  constructor () {
    super();
    this.mode = window.localStorage.getItem('mode');
  }

  async render () {
    document.title = 'Cinema-App: Kinosäle';

    // TODO: GetData via AbstractPage
    // TODO: Template for a paginated cinema display
    // TODO: Template for a new cinema form with send Button
    // TODO: sendData via AbstractPage, display inserted cinema in paginated list
    return `<div class="uk-container uk-margin-large-top">
              <h2> Kinosäle </h2>
            </div>`;
  }
};
