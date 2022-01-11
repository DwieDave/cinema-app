const AbstractPage = require('./AbstractPage');

module.exports = class ErrorPage extends AbstractPage {
  constructor (errorcode, errortext) {
    super();
    this.errorcode = errorcode;
    this.errortext = errortext;
    this.mode = window.localStorage.getItem('mode');
  }

  async render () {
    document.title = 'Cinema-App: Error ' + this.errorcode;

    const template =
            `<header class="uk-container uk-padding-remove uk-container-expand">
                <div id="headerImage" style="background-image: url('/img/sigmund-By-tZImt0Ms-unsplash.jpg');"></div>
            </header>
            <div class="uk-container uk-margin-large-top">
                <h2>Error {{errorcode}}</h2>
                <p>{{errortext}}</p>
                <p>Bitte klicken Sie auf den folgenden Button um zur Hauptseite zurück zu gelangen.</p>
                <p><a data-routerLink class="uk-button uk-button-default" href="/">Zurück zu Home</a></p>
            </div>`;
    return this.renderHandleBars(template, { errorcode: this.errorcode, errortext: this.errortext });
  }
};
