const AbstractPage = require('./AbstractPage');
const mongoose = require('mongoose');

module.exports = class PresentationsPage extends AbstractPage {
  constructor () {
    super();
    this.mode = window.localStorage.getItem('mode');

    // register clickhandler
    this.clickHandler = [{
      // Submit button to push form-data to database
      querySelector: '#presentations-btn-submit',
      callback: async (event) => {
        const formValues = this.getFormValues('#presentations-form-createPresentation');
        if (this.isValidString(formValues['presentations-input-title']) && this.isValidString(formValues['presentations-input-date']) && this.isValidString(formValues['presentations-select-cinema'])) {
          const response = await this.postData('/presentations', { movieTitle: formValues['presentations-input-title'], date: formValues['presentations-input-date'], cinema: mongoose.Types.ObjectId(formValues['presentations-select-cinema']) });
          window.location.reload();
          console.log(response);
        } else {
          window.alert('Alle Felder müssen ausgefüllt sein, um ein Kino erstellen zu können!');
        }
      }
    }];
  }


  async render () {
    document.title = 'Cinema-App: Home';

    const presentations = await this.getData('/presentations');
    const cinemas = await this.getData('/cinemas');
    console.log('PRESENTATIONS', presentations);
    console.log('CINEMAS', cinemas);

    // TODO: Template for a paginated presentation display
    // TODO: Template for a new presentation form with send Button
    // TODO: sendData via AbstractPage, display inserted presentations in paginated list

    const template =
    `<div class="uk-container uk-margin-large-top" id="presentations-div-newPresentation">
        <div class="uk-container-xsmall uk-margin-top">
          <form class="uk-margin-top uk-form-stacked" id="presentations-form-createPresentation">
            <fieldset class="uk-fieldset">
              <legend class="uk-legend uk-margin-bottom">Neue Vorführung anlegen</legend>

              <label class="uk-form-label" for="presentations-input-title">Titel des Films</label>
              <div class="uk-form-controls">
                  <input class="uk-input" id="presentations-input-title" name="presentations-input-title" type="text" placeholder="">
              </div>

              <div class="uk-margin">
                <label class="uk-form-label" for="presentations-input-date">Datum</label>
                <div class="uk-form-controls">
                    <input class="uk-input" id="presentations-input-date" name="presentations-input-date" type="date" placeholder="">
                </div>
              </div>

              <label class="uk-form-label" for="presentations-select-cinema">Kino</label>
              <div class="uk-form-controls">
                  <select class="uk-select" id="presentations-select-cinema" name="presentations-select-cinema">
                    {{#each cinemas}}
                    <option value="{{this._id}}">{{this.name}}</option>
                    {{/each}}
                  </select>
              </div>
            </fieldset>
          </form>
          <button class="uk-button uk-button-default uk-margin-top" id="presentations-btn-submit">Erstellen</button>
          <hr>
        </div>
        
        <div class="uk-container" id="presentation-div-presentationList">
          <h2> Vorführungen </h2>

          <ul class="uk-list">
            {{#each presentations}}
            <li class="uk-margin-small-top">
              <h3>{{this.movieTitle}}</h3>
              <div>
                <ul class="uk-list uk-list-disc">
                  <li>Datum: {{this.date}}</li>
                  <li>Kino: {{this.cinema.name}}</li>
                </ul>
              </div>
            </li>
            {{/each}}
          </ul>
        </div>
      </div>`;

    return this.renderHandleBars(template, { presentations, cinemas });
  }
};