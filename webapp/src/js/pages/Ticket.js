const AbstractPage = require('./AbstractPage');

module.exports = class TicketPage extends AbstractPage {
  constructor (options) {
    super();

    this.mode = window.localStorage.getItem('mode');

    // Get injected Router reference
    if (options?.Router) this.router = options.Router;

    // pagination
    this.cardHeight = 272;
    this.offset = 520;

    // Fill ClickHandler Array
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
    }, {
      querySelector: '#printResponseButton',
      callback: (event) => {
        this.printReservation();
        event.preventDefault();
      }
    }];

    this.addPaginationHandler();
    this.addPaginationListener();
  }

  selectPresentation (event) {
    // If presentationid exists on target set activePresentation
    if (event?.currentTarget?.dataset?.presentationid) this.activePresentation = event.currentTarget.dataset.presentationid;
    // Save form in class attribute
    this.saveForm();
    // Re-Render Page without animation
    this.router.renderPage({ animation: false });
  }

  async sendTicket (event) {
    // Get form values
    const sendData = this.getFormValues('#newTicketForm');
    // Add active Presentation to formvalues
    sendData.presentation = this.activePresentation;

    // Test if all necessary keys are filled
    let test = true;
    const requiredFields = ['presentation', 'reservedSeats', 'customerName'];
    requiredFields.forEach((key) => {
      if (test) {
        if (!this.isFilled(sendData[key])) test = false;
      }
    });

    if (test) {
      // Find active Presentation in presentations array to get freeSeats
      const presentation = this.presentations.find((pres) => pres._id === sendData.presentation);

      // Error Handling with toast messages
      if (!presentation) return this.toast('Die Vorführung konnte nicht gefunden werden', 'danger');
      if (presentation.freeSeats === 0) return this.toast('Diese Vorführung ist leider ausgebucht.', 'danger');
      if (presentation.freeSeats < sendData.reservedSeats) return this.toast('Zu viele Plätze angefragt. Leider sind nicht mehr so viele Plätze vorhanden', 'danger');

      // Send Reservation
      try {
        const response = await this.postData('/reservations', sendData);
        if (response?.data) {
          // Save response - including QR-code
          this.response = response.data;
          if (this.response.reservation?.presentation?.date) {
            // Format Date from DB output
            this.response.reservation.presentation.date = this.formatDate(this.response.reservation.presentation.date);
          }

          // Reset Page
          delete this.presentations;
          delete this.activePresentation;
          delete this.form;

          await this.router.renderPage();
          this.openModal('#responseModal');
        }
      } catch (error) {
        // Error Handling - Server Error
        this.toast('Reservierung konnte nicht gespeichert werden, Bitte laden Sie die Seite neu und versuchen Sie es erneut.', 'danger');
        console.error(error);
      }
    } else this.toast('Nicht alle Pflichtfelder ausgefüllt!', 'danger');
  }

  printReservation () {
    // Print Modal container
    this.printContainer('#responseModal .uk-modal-body #reservation', 'CinemaApp Ticket', window.innerWidth, window.innerHeight);
  }

  async render () {
    document.title = 'Cinema-App: Tickets reservieren';

    // Cache presentations in Class property
    if (!this.presentations) {
      this.presentations = await this.getData('/presentations');
      this.presentations = this.presentations.map(pres => {
        pres.date = this.formatDate(pres.date);
        return pres;
      });
    }

    // Calculate start and end of displayed array slice
    const displayedPresentations = this.calcStartEnd(this.presentations);

    const template =
      `<div id="TicketPage">
        <div class="uk-container uk-margin-medium-top">
            <h2 class="uk-margin-remove-bottom"> Freie Tickets Reservieren </h2>
            <h4 class="uk-margin-remove-top"> 1. Vorführung auswählen </h4>

            <!-- Vorführungs GRID -->
            <div class="uk-child-width-expand@s uk-text-center uk-grid-match" uk-grid>
                {{#each presentations}}
                <div class="uk-width-1-3@m">
                    <div data-presentationid="{{this._id}}"
                        class="uk-card uk-card-default uk-card-body presentationCard{{#if (eq this._id ../activePresentation)}} uk-card-primary{{/if}}">
                        <h4>{{this.movieTitle}}</h4>
                        <ul class="uk-list">
                            <li><strong>Datum:</strong><br>{{this.date}}</li>
                            <li><strong>Kinosaal:</strong><br>{{this.cinema.name}}</li>
                            <li><strong>Freie Plätze:</strong><br>{{this.freeSeats}}</li>
                        </ul>
                    </div>
                </div>
                {{/each}}
            </div>

            <!-- Pagination -->
            <ul class="uk-pagination" uk-margin style="justify-content:center">
              <li><a href="javascript:void(0)" class="previousPage"><span uk-pagination-previous></span></a></li>
              {{#each pages}}
                <li {{#if (eq this ../currentPage)}}class="uk-active"{{/if}}>
                  {{#if (eq this ../currentPage)}}
                    <span>{{this}}</span>
                  {{else}} 
                    <a href="javascript:void(0)" data-page="{{this}}" class="changeToPage">{{this}}</a>
                  {{/if}}
                </li>
              {{/each}}
              <li><a href="javascript:void(0)" class="nextPage"><span uk-pagination-next></span></a></li>
            </ul>

            <!-- Reservierungs FORM -->
            {{#if activePresentation}}
            <hr class="uk-margin-medium-top">
            <h4> 2. Daten eingeben und reservieren </h4>
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
            
            <!-- Reservierungsbestätigungs MODAL -->
            {{#if response}}
              <div id="responseModal" uk-modal>
                <div class="uk-modal-dialog uk-modal-body">
                    <div id="reservation">
                      <h2 class="uk-modal-title">Ihre Reservierung</h2>
                      <div id="qrcode">
                        <img src="{{response.qrcode}}" alt="Ihre Reservierung - QR-code">
                      </div>
                      <ul>
                        <li><strong>Film:</strong> {{response.reservation.presentation.movieTitle}}</li>
                        <li><strong>Datum der Vorstellung:</strong> {{response.reservation.presentation.date}}</li>
                        <li><strong>Reservierte Sitzplätze:</strong> {{response.reservation.reservedSeats}}</li>
                        <li><strong>Ihr Name:</strong> {{response.reservation.customerName}}</li>
                        <li><strong>Kinosaal:</strong> {{response.reservation.presentation.cinema.name}}</li>
                      </ul>
                    </div>
                    <p class="uk-text-right">
                        <button id="printResponseButton" class="uk-button uk-button-default" type="button">Drucken</button>
                        <button class="uk-button uk-button-primary uk-modal-close" type="button">Fertig</button>
                    </p>
                </div>
              </div>
            {{/if}}
        </div>
      </div>`;

    const data = {
      presentations: displayedPresentations,
      activePresentation: this.activePresentation,
      form: this.form,
      response: this.response,
      currentPage: this.currentPage,
      pages: this.pages
    };
    return this.renderHandleBars(template, data);
  }
};
