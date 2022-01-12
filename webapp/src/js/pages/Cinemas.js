const AbstractPage = require('./AbstractPage');

module.exports = class CinemasPage extends AbstractPage {
  constructor () {
    super();
    this.mode = window.localStorage.getItem('mode');

    // register clickhandler
    this.clickHandler = [{
      // Submit button to push form-data to database
      querySelector: '#cinemas-btn-submit',
      callback: async (event) => {
        const formValues = this.getFormValues('#cinemas-form-createCinema');
        if (this.isFilled(formValues['cinemas-input-name']) && this.isFilled(formValues['cinemas-input-seatRows']) && this.isFilled(formValues['cinemas-input-seatsPerRow'])) {
          const response = await this.postData('/cinemas', { name: formValues['cinemas-input-name'], seatRows: formValues['cinemas-input-seatRows'], seatsPerRow: formValues['cinemas-input-seatsPerRow'] });
          console.log(response);
          window.location.reload();
        } else {
          window.alert('Alle Felder müssen ausgefüllt sein, um ein Kino erstellen zu können!');
        }
      }
    }];
  }

  async render () {
    document.title = 'Cinema-App: Kinosäle';

    const cinemas = await this.getData('/cinemas');
    console.log('CINEMAS: ', cinemas);

    // GetData via AbstractPage
    // Template for a paginated cinema display
    // Template for a new cinema form with send Button
    // sendData via AbstractPage, display inserted cinema in paginated list

    const template =
      `<div class="uk-container uk-margin-small-top" id="cinemas-div-newCinema">
            <div class="uk-margin-top">
                <form class="uk-margin-top uk-form-stacked" id="cinemas-form-createCinema">
                    <fieldset class="uk-fieldset">
                        <legend class="uk-legend uk-margin-bottom">Neues Kino anlegen</legend>

                        <div class="uk-grid-match uk-margin" uk-grid>
                          <div class="uk-width-expand@m">
                            <label class="uk-form-label" for="cinemas-input-name">Name</label>
                            <div class="uk-form-controls">
                                <input class="uk-input" id="cinemas-input-name" name="cinemas-input-name" type="text"
                                    placeholder="">
                            </div>
                          </div>
                          <div class="uk-width-expand@m">
                            <label class="uk-form-label" for="cinemas-input-seatRows">Anzahl der Reihen</label>
                            <div class="uk-form-controls">
                                <input class="uk-input" id="cinemas-input-seatRows" name="cinemas-input-seatRows" type="number"
                                    placeholder="">
                            </div>
                          </div>
                          <div class="uk-width-expand@m">
                            <label class="uk-form-label" for="cinemas-input-seatsPerRow">Anzahl der Sitzplätze pro Reihe</label>
                            <div class="uk-form-controls">
                                <input class="uk-input" id="cinemas-input-seatsPerRow" name="cinemas-input-seatsPerRow"
                                    type="number" placeholder="">
                            </div>
                          </div>
                          <div class="uk-width-auto@m" style="align-items:end">
                            <button style="height:40px;" class="uk-button uk-button-default uk-margin-top uk-button-primary" id="cinemas-btn-submit">Erstellen</button>
                          </div>
                        </div>                        
                    </fieldset>
                </form>
                <hr>
            </div>
        </div>
        
        <div class="uk-container" id="cinemas-div-cinemaList">
            <h2> Kinosäle </h2>
            
                <div class="uk-child-width-expand@s uk-text-center uk-grid-match" uk-grid>
                    {{#each cinemas}}
                    <div class="uk-width-1-3@m">
                        <div class="uk-card uk-card-default uk-card-body">
                            <h4>{{this.name}}</h4>
                            <ul class="uk-list">
                                <li><strong>Anzahl der Reihen:</strong> {{this.seatRows}}</li>
                                <li><strong>Anzahl der Sitzplätze pro Reihe:</strong> {{this.seatsPerRow}}</li>
                            </ul>
                        </div>
                    </div> 
                    {{/each}}
                </div>
            </div>`;

    return this.renderHandleBars(template, { cinemas });
  }
};
