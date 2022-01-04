const { formatDate } = require('../Helper');
const AbstractPage = require('./AbstractPage');

module.exports = class TicketPage extends AbstractPage {
  constructor (options) {
    super();
    this.mode = window.localStorage.getItem('mode');
    if (options) {
      if (options.Router) this.router = options.Router;
    }

    this.clickHandler = [{
      querySelector: '.presentationCard',
      callback: (event) => {
        this.selectPresentation(event);
      }
    }];
  }

  selectPresentation (event) {
    if (event?.currentTarget?.dataset?.presentationid) this.activePresentation = event.currentTarget.dataset.presentationid;
    this.router.renderPage({ animation: false });
  }

  sendTicket (event) {
  }

  async render () {
    document.title = 'Cinema-App: Tickets reservieren';

    if (!this.presentations) {
      this.presentations = await this.getData('/presentations');
      this.presentations = this.presentations.map(pres => {
        pres.date = formatDate(pres.date);
        return pres;
      });
      console.log('GOT DATA', this.presentations.length);
    }

    console.log(this.activePresentation);

    // TODO: Template for a new Ticket form with send Button
    // TODO: sendData via AbstractPage, display printable QR-code

    const template = `<div id="TicketPage">
                        <div class="uk-container uk-margin-large-top">
                            <h2> Freie Tickets Buchen </h2>
                            <h4> Vorführung auswählen </h4>
                            <div class="uk-child-width-expand@s uk-text-center uk-grid-match" uk-grid>
                            {{#each presentations}}
                              <div class="uk-width-1-3@m">
                                  <div data-presentationid="{{this._id}}" class="uk-card uk-card-default uk-card-body presentationCard{{#if (eq this._id ../activePresentation)}} uk-card-primary{{/if}}">
                                    <ul class="uk-list">
                                      <li><strong>Film:</strong><br>{{this.movieTitle}}</li>
                                      <li><strong>Datum:</strong><br>{{this.date}}</li>
                                      <li><strong>Kinosaal:</strong><br>{{this.cinema.name}}</li>
                                    </ul>
                                  </div>
                              </div>
                            {{/each}}
                          </div>
                        </div>
                      </div>`;

    const data = { presentations: this.presentations, activePresentation: this.activePresentation };
    console.log('renderData', data);
    return this.renderHandleBars(template, data);
  }
};
