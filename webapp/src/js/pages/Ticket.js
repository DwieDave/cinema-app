const AbstractPage = require('./AbstractPage');

module.exports = class TicketPage extends AbstractPage {
  constructor () {
    super();
    this.mode = window.localStorage.getItem('mode');
  }

  async render () {
    document.title = 'Cinema-App: Tickets reservieren';

    // TODO: Template for a new Ticket form with send Button
    // TODO: sendData via AbstractPage, display printable QR-code

    return `<div class="uk-container uk-margin-large-top">
                  <h2> Freie Tickets Buchen </h2>
              </div>`;
  }
};
