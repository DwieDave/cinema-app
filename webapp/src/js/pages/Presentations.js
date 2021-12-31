import AbstractPage from './AbstractPage';

export default class PresentationsView extends AbstractPage {
  constructor () {
    super();
    this.mode = window.localStorage.getItem('mode');
    this.clickHandler = [{
      querySelector: '#click-me-button',
      callback: (event) => {
        this.sampleFunction(event);
      }
    }];
  }

  async render () {
    document.title = 'Cinema-App: Home';
    const template =
      `<div class="uk-container uk-margin-large-top">
          <h2> Vorführungen </h2>
          <button id="click-me-button" class="uk-button uk-button-default">CLICK ME</button>
      
          <form class="uk-margin-top">
              <fieldset class="uk-fieldset">
                  <legend class="uk-legend">Legend</legend>
      
                  <div class="uk-margin">
                      <input class="uk-input" type="text" name="name" placeholder="Input">
                  </div>
      
                  <div class="uk-margin">
                      <select class="uk-select">
                          <option>Option 01</option>
                          <option>Option 02</option>
                      </select>
                  </div>
      
                  <div class="uk-margin">
                      <textarea class="uk-textarea" rows="5" placeholder="Textarea"></textarea>
                  </div>
      
                  <div class="uk-margin uk-grid-small uk-child-width-auto uk-grid">
                      <label><input class="uk-radio" type="radio" name="radio2" checked> A</label>
                      <label><input class="uk-radio" type="radio" name="radio2"> B</label>
                  </div>
      
                  <div class="uk-margin uk-grid-small uk-child-width-auto uk-grid">
                      <label><input class="uk-checkbox" type="checkbox" checked> A</label>
                      <label><input class="uk-checkbox" type="checkbox"> B</label>
                  </div>
      
                  <div class="uk-margin">
                      <input id="formInput" class="uk-range" type="range" value="2" min="0" max="10" step="0.1">
                  </div>
              </fieldset>
          </form>
      </div>`;
    return this.renderHandleBars(template, {});
  }

  sampleFunction (ev) {
    console.log('sampleFUNCTION', this.getValue('#formInput'));
  }
}
