import AbstractPage from './AbstractPage';

export default class CinemasView extends AbstractPage {
  constructor () {
    super();
    this.mode = window.localStorage.getItem('mode');
  }

  async render () {
    document.title = 'Cinema-App: Kinosäle';
    return `<div class="uk-container uk-margin-large-top">
                  <h2> Kinosäle </h2>
              </div>`;
  }
}
