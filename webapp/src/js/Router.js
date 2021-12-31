const CinemasPage = require('./pages/Cinemas');
const HomePage = require('./pages/Home');
const PresentationsPage = require('./pages/Presentations');
const TicketPage = require('./pages/Ticket');

/*  Router: Handles Routes and Pages  */
module.exports = class Router {
  constructor () {
    this.initialize();
  }

  async initialize () {
    this.pages = [
      { path: '/', viewClass: HomePage },
      { path: '/page/ticket', viewClass: TicketPage },
      { path: '/page/cinemas', viewClass: CinemasPage },
      { path: '/page/presentations', viewClass: PresentationsPage }
    ];
    this.page = this.findPage(window.location.pathname);
    if (this.page) await this.renderPage(this.page);
    // TODO: else: render Error Page
  }

  /* findPage: finds page from router Pages array that matches the current location pathname */

  findPage (urlpath) {
    if (this.pages?.length > 0) {
      for (const page of this.pages) {
        const routeRegex = new RegExp('^' + page.path.replace(/\//g, '\\/') + '$');
        if (urlpath.match(routeRegex) !== null) return page;
      }
      return null;
    }
  }

  /*  renderPage: Creates a Page Class according to the viewClass property of the RouterPage
    Renders HTML content of class and registers clickHandlers of the class if given
    removes/adds ui-kits active class to the menu-entry linking to the current page */

  async renderPage (routerPage) {
    // setting 'uk-active' class if current path is linked in the menu-item
    const mode = window.localStorage.getItem('mode');
    const menu = document.querySelector('#menu' + mode[0].toUpperCase() + mode.slice(1));

    for (let i = 0; i < menu.children.length; i++) {
      const child = menu.children[i];
      child.classList.remove('uk-active');
      if (child.children[0].attributes.href.value === routerPage.path) child.classList.add('uk-active');
    }

    // creating class
    const PageClass = (routerPage.viewClass);
    const page = new PageClass();

    // rendering HTML content into #app container
    const appContainer = document.querySelector('#app');
    if (appContainer) {
      appContainer.innerHTML = '';
      appContainer.innerHTML = await page.render();

      // Workaround to re-trigger uikit animation on pageRender
      appContainer.style.animation = 'none';
      ((element) => {
        return element.offsetHeight;
      })(appContainer);
      appContainer.style.animation = null;
    }

    // registering pages clickHandlers - if given
    const clickHandlers = page.clickHandler;
    if (clickHandlers?.length > 0) {
      for (const clickHandler of clickHandlers) {
        page.registerClickHandler(clickHandler.querySelector, clickHandler.callback);
      }
    }
  }

  /*  navigateTo: change window url without navigating to it
    call pageRouter function to render content based on the new url */

  navigateTo (url) {
    window.history.pushState(null, null, url);
    this.initialize();
  }
};
