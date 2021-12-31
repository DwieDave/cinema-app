// TODO: Change to commonJS Modules (require & module.exports
import AbstractPage from './AbstractPage';

export default class HomeView extends AbstractPage {
  constructor () {
    super();
    this.mode = window.localStorage.getItem('mode');
  }

  async render () {
    document.title = 'Cinema-App: Home';

    // TODO: Template for a better looking Home page

    const template =
      `<header class="uk-container uk-padding-remove uk-container-expand">
          <div id="headerImage"></div>
      </header>
      <div class="uk-container uk-margin-large-top">
          <h2> Home </h2>
          <p>Willkommen {{greeting}}</p>
      </div>`;
    return this.renderHandleBars(template, { greeting: this.mode === 'customer' ? 'Kunde' : 'Betreiber' });
  }
}
