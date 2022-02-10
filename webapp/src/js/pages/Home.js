const AbstractPage = require('./AbstractPage');

module.exports = class HomePage extends AbstractPage {
  constructor () {
    super();
    this.mode = window.localStorage.getItem('mode');
  }

  async render () {
    document.title = 'Cinema-App: Home';

    const template =
      `<header class="uk-container uk-padding-remove uk-container-expand">
          <div id="headerImage" {{#if (eq greeting "Betreiber")}}style="background-image: url('/img/kalle-saarinen-o3kWCB9hSBA-unsplash.jpg')"{{/if}}></div>
      </header>
      <div class="uk-container uk-margin-large-top">
          <h2> Home </h2>
          {{#if (eq greeting "Kunde")}}
            <div class="uk-grid-divider uk-child-width-expand@s uk-text-center uk-margin-large-top" uk-grid>
              <div>
                <img src="/img/ticket-outline.svg" width="64px"><br>
                <p class="uk-text-justify">Als Kunde haben Sie auf unserer Website die Möglichkeit eine oder mehrere Tickets für Film-Vorstellungen in unserem Kino zu buchen.</p>
              </div>
              <div>
                <img src="/img/qr-code-outline.svg" width="64px"><br>
                <p class="uk-text-justify">Nach dem Buchungsvorgang erhalten Sie einen QR-Code über den Sie Ihre Buchung authentifizieren können und welchen Sie leicht ausdrucken können.</p>
              </div>
              <div>
                <img src="/img/film-outline.svg" width="64px"><br>
                <p class="uk-text-justify">Buchen Sie jetzt ihr nächstes Kino-Abenteuer bequem von der Couch. Wir freuen uns auf Ihren Besuch!</p>
              </div>
            </div>
          {{else}}
            <div class="uk-grid-divider uk-child-width-expand@s uk-text-center uk-margin-large-top" uk-grid>
              <div>
                <img src="/img/cog-outline.svg" width="64px"><br>
                <p class="uk-text-justify">Als Betreiber können Sie im Kino-Backend Ihr gesamtes Kino verwalten. </p>
              </div>
              <div>
                <img src="/img/apps-outline.svg" width="64px"><br>
                <p class="uk-text-justify">Legen Sie bequem neue Kinosäle an und erstellen Sie für selbige neue Vorstellungen.</p>
              </div>
              <div>
                <img src="/img/accessibility-outline.svg" width="64px"><br>
                <p class="uk-text-justify">Eine übersichtliche Gestaltung erleichtert es Ihren Kunden schnell neue Tickets zu buchen.</p>
              </div>
            </div>
          {{/if}}
      </div>`;
    return this.renderHandleBars(template, { greeting: this.mode === 'customer' ? 'Kunde' : 'Betreiber' });
  }
};
