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
    }, {
      querySelector: '#sendTicket',
      callback: (event) => {
        this.sendTicket(event);
        event.preventDefault();
      }
    }];
  }

  selectPresentation (event) {
    if (event?.currentTarget?.dataset?.presentationid) this.activePresentation = event.currentTarget.dataset.presentationid;
    this.form = this.getFormValues('#newTicketForm');
    this.router.renderPage({ animation: false });
  }

  async sendTicket (event) {
    const sendData = this.getFormValues('#newTicketForm');
    sendData.presentation = this.activePresentation;

    let test = true;
    const requiredFields = ['presentation', 'reservedSeats', 'customerName'];
    requiredFields.forEach((key) => {
      if (test) {
        if (!this.isFilled(sendData[key])) test = false;
      }
    });

    if (test) console.log(sendData);
    else window.alert('Nicht alle Pflichtfelder ausgefüllt!');
  }

  async render () {
    document.title = 'Cinema-App: Tickets reservieren';

    if (!this.presentations) {
      this.presentations = await this.getData('/presentations');
      this.presentations = this.presentations.map(pres => {
        pres.date = this.formatDate(pres.date);
        return pres;
      });
    }

    // TODO: Paginate Presentations
    // TODO: Template for a new Ticket form with send Button
    // TODO: sendData via AbstractPage, display printable QR-code

    const template = `<div id="TicketPage">
                        <div class="uk-container uk-margin-medium-top">
                            <h2 class="uk-margin-remove-bottom"> Freie Tickets Buchen </h2>
                            <h4 class="uk-margin-remove-top"> Vorführung auswählen </h4>
                            <div class="uk-child-width-expand@s uk-text-center uk-grid-match" uk-grid>
                                {{#each presentations}}
                                <div class="uk-width-1-3@m">
                                    <div data-presentationid="{{this._id}}"
                                        class="uk-card uk-card-default uk-card-body presentationCard{{#if (eq this._id ../activePresentation)}} uk-card-primary{{/if}}">
                                        <ul class="uk-list">
                                            <li><strong>Film:</strong><br>{{this.movieTitle}}</li>
                                            <li><strong>Datum:</strong><br>{{this.date}}</li>
                                            <li><strong>Kinosaal:</strong><br>{{this.cinema.name}}</li>
                                        </ul>
                                    </div>
                                </div>
                                {{/each}}
                            </div>
                            {{#if activePresentation}}
                            <h4> Daten eingeben und reservieren </h4>
                            <form class="uk-form-stacked" id="newTicketForm">
                                <div class="uk-grid-match uk-margin" uk-grid>
                                    <div class="uk-width-expand@m">
                                        <label class="uk-form-label" for="form-stacked-text">Ihr Name *</label>
                                        <div class="uk-form-controls">
                                            <input class="uk-input" id="form-stacked-text" type="text" name="customerName"
                                                placeholder="Ihr Name *" {{#if form.customerName}}value="{{form.customerName}}" {{/if}}>
                                        </div>
                                    </div>
                                    <div class="uk-width-expand@m">
                                        <label class="uk-form-label" for="form-stacked-text">Anzahl Sitzplätze *</label>
                                        <div class="uk-form-controls">
                                            <input class="uk-input" id="form-stacked-text" type="number" name="reservedSeats"
                                                placeholder="Anzahl Sitzplätze *" {{#if form.reservedSeats}}value="{{form.reservedSeats}}"
                                                {{/if}}>
                                        </div>
                                    </div>
                                    <div class="uk-width-expand@m uk-margin-auto-top" style="max-height: 40px;">
                                        <button id="sendTicket" class="uk-button uk-button-primary">Tickets reservieren</button>
                                    </div>
                                </div>
                            </form>
                            {{/if}}
                        </div>
                    </div>`;

    const data = { presentations: this.presentations, activePresentation: this.activePresentation, form: this.form };
    return this.renderHandleBars(template, data);
  }
};
