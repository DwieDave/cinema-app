const AbstractPage = require('./AbstractPage');

module.exports = class PresentationsPage extends AbstractPage {
  constructor () {
    super();
    this.mode = window.localStorage.getItem('mode');
    // register clickhandler for demo Button with big arrow function to reference this correctly
    this.clickHandler = [{
      querySelector: '#click-me-button',
      callback: (event) => {
        this.sampleFunction(event);
      }
    }];
  }

  sampleFunction (ev) {
    console.log(this.getFormValues('#demoForm'));
    // console.log('PresentationPage', );
  }

  async render () {
    document.title = 'Cinema-App: Home';

    const presentations = await this.getData('/presentations');
    console.log('PRESENTATIONS', presentations);

    // TODO: Template for a paginated presentation display
    // TODO: Template for a new presentation form with send Button
    // TODO: sendData via AbstractPage, display inserted presentations in paginated list

    const template =
      `<div class="uk-container uk-margin-large-top">
          <h2> Vorführungen </h2>
          <button id="click-me-button" class="uk-button uk-button-default">CLICK ME</button>
      
          <form class="uk-margin-top" id="demoForm">
              <fieldset class="uk-fieldset">
                  <legend class="uk-legend">Legend</legend>
      
                  <div class="uk-margin">
                      <input class="uk-input" type="text" name="name" placeholder="Input">
                  </div>
      
                  <div class="uk-margin">
                      <select class="uk-select" name="presentation">
                          <option value="87923847jfjkf">The Matrix</option>
                          <option value="8912374095öklfg">Findet Nemo</option>
                      </select>
                  </div>
      
                  <div class="uk-margin">
                      <textarea class="uk-textarea" rows="5" placeholder="Textarea" name="nachricht"></textarea>
                  </div>
      
                  <div class="uk-margin">
                      <input id="formInput" class="uk-range" type="range" value="2" min="0" max="10" step="0.1"  name="reservedSeats">
                  </div>
              </fieldset>
          </form>
      </div>`;
    return this.renderHandleBars(template, {});
  }
};
