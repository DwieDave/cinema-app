import AbstractPage from './AbstractPage';

export default class TicketView extends AbstractPage {
  constructor () {
    super();
    this.mode = window.localStorage.getItem('mode');
  }

  render () {
    document.title = 'Cinema-App: Tickets reservieren';
    return `<div class="uk-container uk-margin-large-top">
                  <h2> Freie Tickets Buchen </h2>
              </div>`;
  }
}
