const Router = require('./Router');

module.exports = class Application {
  constructor () {
    // Router initializing
    this.router = new Router();

    this.mode = 'customer';

    this.addClickListener();
    this.addWindowListener();
  }

  /* addClickListener: adds click Listener for mode Selection & Navigation */
  addClickListener () {
    document.addEventListener('click', (event) => {
      if (event.target.matches('.modeSelection')) {
        // Mode selection
        const mode = event.target.matches('.owner') ? 'owner' : 'customer';
        this.setMode(mode);
        this.router.navigateTo('/');
      } else if (event.target.matches('[data-routerLink]')) {
        // Router Link Handling:
        // prevent default link following (would try to open directory /page/cinemas for example)
        event.preventDefault();
        // instead navigate with own routing function
        this.router.navigateTo(event.target.href);
      }
    }, false);
  }

  /* addWindowListener: window DOMContentLoaded: Set saved mode after loading Page */
  addWindowListener () {
    window.addEventListener('DOMContentLoaded', () => {
      const mode = window.localStorage.getItem('mode');
      if (mode && mode !== '') this.setMode(mode);
      else this.setMode('customer');
    });
  }

  /*  setMode: Change menu and button styles to display owner or customer menu
      save set mode in localStorage */
  setMode (mode) {
    window.localStorage.setItem('mode', mode);
    if (mode === 'customer') {
      document.querySelector('#menuCustomer').style.display = 'flex';
      document.querySelector('#menuOwner').style.display = 'none';
      document.querySelector('.customer').classList.add('uk-button-primary');
      document.querySelector('.owner').classList.remove('uk-button-primary');
    } else if (mode === 'owner') {
      document.querySelector('#menuOwner').style.display = 'flex';
      document.querySelector('#menuCustomer').style.display = 'none';
      document.querySelector('.customer').classList.remove('uk-button-primary');
      document.querySelector('.owner').classList.add('uk-button-primary');
    }
  }
};
