const AbstractPage = require('./AbstractPage');
const mongoose = require('mongoose');

module.exports = class PresentationsPage extends AbstractPage {
  constructor (options) {
    super();
    this.mode = window.localStorage.getItem('mode');

    // Get injected Router reference
    if (options?.Router) this.router = options.Router;

    // pagination offset
    this.offset = 370;

    // register clickhandler
    this.clickHandler = [{
      // Submit button to push form-data to database
      querySelector: '#presentations-btn-submit',
      callback: async (event) => {
        const formValues = this.getFormValues('#presentations-form-createPresentation');
        if (this.isFilled(formValues['presentations-input-title']) && this.isFilled(formValues['presentations-input-date']) && this.isFilled(formValues['presentations-select-cinema'])) {
          const response = await this.postData('/presentations', { movieTitle: formValues['presentations-input-title'], date: formValues['presentations-input-date'], cinema: mongoose.Types.ObjectId(formValues['presentations-select-cinema']) });
          window.location.reload();
          console.log(response);
        } else {
          window.alert('Alle Felder müssen ausgefüllt sein, um ein Kino erstellen zu können!');
        }
      }
    }];

    this.addPaginationHandler();
    this.addPaginationListener();
  }

  async render () {
    document.title = 'Cinema-App: Home';

    // Cache presentations in Class property
    if (!this.presentations) {
      this.presentations = await this.getData('/presentations');
      this.presentations = this.presentations.map(pres => {
        pres.date = this.formatDate(pres.date);
        return pres;
      });
    }

    // Cache cinemas in Class property
    if (!this.cinemas) {
      this.cinemas = await this.getData('/cinemas');
    }

    // Calculate start and end of displayed array slice
    const displayedPresentations = this.calcStartEnd(this.presentations);

    const template =
    `<div class="uk-container uk-margin-small-top" id="presentations-div-newPresentation">
        <div class="uk-margin-top">
          <form class="uk-margin-top uk-form-stacked" id="presentations-form-createPresentation">
            <fieldset class="uk-fieldset">
              <legend class="uk-legend uk-margin-bottom">Neue Vorführung anlegen</legend>
              
              <div class="uk-grid-match uk-margin" uk-grid>
                <div class="uk-width-expand@m">
                  <label class="uk-form-label" for="presentations-input-title">Titel des Films*</label>
                  <div class="uk-form-controls">
                      <input class="uk-input" id="presentations-input-title" name="presentations-input-title" type="text" placeholder="">
                  </div>
                </div>

                <div class="uk-width-expand@m">
                  <label class="uk-form-label" for="presentations-input-date">Datum*</label>
                  <div class="uk-form-controls">
                      <input class="uk-input" id="presentations-input-date" name="presentations-input-date" type="date" placeholder="">
                  </div>
                </div>
                
                <div class="uk-width-expand@m">
                  <label class="uk-form-label" for="presentations-select-cinema">Kino*</label>
                  <div class="uk-form-controls">
                      <select class="uk-select" id="presentations-select-cinema" name="presentations-select-cinema">
                        {{#each cinemas}}
                        <option value="{{this._id}}">{{this.name}}</option>
                        {{/each}}
                      </select>
                  </div>
                </div>
                <div class="uk-width-auto@m" style="align-items:end">
                  <button style="height:40px;" class="uk-button uk-button-default uk-margin-top uk-button-primary" id="presentations-btn-submit">Erstellen</button>
                </div>
              </div>
            </fieldset>
          </form>
          <hr>
        </div>
      </div>

      <div class="uk-container" id="cinemas-div-cinemaList">
        <h2> Vorführungen </h2>

        <div class="uk-child-width-expand@s uk-text-center uk-grid-match" uk-grid>
            {{#each presentations}}
            <div class="uk-width-1-3@m">
                <div class="uk-card uk-card-default uk-card-body">
                    <h4>{{this.movieTitle}}</h4>
                    <ul class="uk-list">
                        <li><strong>Datum:</strong> {{this.date}}</li>
                        <li><strong>Kino:</strong> {{this.cinema.name}}</li>
                    </ul>
                </div>
            </div> 
            {{/each}}
        </div>
    </div>
    
    <!-- Pagination -->
          <div uk-container>
            <ul class="uk-pagination uk-margin" style="justify-content:center">
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
          </div>
          `;

    const data = {
      presentations: displayedPresentations,
      cinemas: this.cinemas,
      pages: this.pages
    };

    return this.renderHandleBars(template, data);
  }
};
