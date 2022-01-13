const CinemasPage = require('./pages/Cinemas');
const ErrorPage = require('./pages/ErrorPage');
const HomePage = require('./pages/Home');
const PresentationsPage = require('./pages/Presentations');
const TicketPage = require('./pages/Ticket');

/*  Router: Handles Routes and Pages  */
module.exports = class Router {
  constructor () {
    this.pages = [
      { path: '/', viewClass: HomePage },
      { path: '/page/ticket', viewClass: TicketPage },
      { path: '/page/cinemas', viewClass: CinemasPage },
      { path: '/page/presentations', viewClass: PresentationsPage }
    ];
    this.registeredListeners = [];
    this.createPage();
  }

  async createPage () {
    const page = this.findPage(window.location.pathname);
    if (page) {
      // creating class
      const PageClass = (page.viewClass);
      this.page = new PageClass({ Router: this });
      this.routerpage = page;
      await this.renderPage(page);
    } else {
      this.page = new ErrorPage(404, 'Seite nicht gefunden.');
      await this.renderPage({ path: '/error', viewClass: ErrorPage });
      this.changeURL('/error');
    }
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

  async renderPage (options) {
    // setting 'uk-active' class if current path is linked in the menu-item
    const mode = window.localStorage.getItem('mode');
    const menu = document.querySelector('#menu' + mode[0].toUpperCase() + mode.slice(1));

    for (let i = 0; i < menu.children.length; i++) {
      const child = menu.children[i];
      child.classList.remove('uk-active');
      if (child.children[0].attributes.href.value === this.routerpage.path) child.classList.add('uk-active');
    }

    // rendering HTML content into #app container
    const appContainer = document.querySelector('#app');
    if (appContainer) {
      appContainer.innerHTML = '';
      appContainer.innerHTML = await this.page.render();

      // registering pages clickHandlers - if given via clickHandler attribute
      const clickHandlers = this.page.clickHandler;
      if (clickHandlers?.length > 0) {
        for (const clickHandler of clickHandlers) {
          this.page.registerClickHandler(clickHandler.querySelector, clickHandler.callback);
        }
      }

      // Remove all old registered Listeners
      if (this.registeredListeners.length > 0) {
        for (const eventListener of this.registeredListeners) {
          eventListener.element.removeEventListener(eventListener.event, eventListener.listener);
        }
        this.registeredListeners = [];
      }

      // Registering pages clickHandlers - if given via clickHandler attribute
      const eventListeners = this.page.eventListener;
      if (eventListeners?.length > 0) {
        for (const eventListener of eventListeners) {
          const listener = debounce(100, (event) => { eventListener.callback(); });
          eventListener.element.addEventListener(eventListener.event, listener);
          this.registeredListeners.push({
            element: eventListener.element,
            event: eventListener.event,
            listener: listener
          });
        }
      }

      // Workaround to re-trigger uikit animation on pageRender
      if (options?.animation !== false) {
        appContainer.style.animation = 'none';
        ((element) => {
          return element.offsetHeight;
        })(appContainer);
        appContainer.style.animation = null;
        // Re-trigger pagination
        window.dispatchEvent(new Event('resize'));
      }
    }
  }

  /*  navigateTo: "soft navigate" to url
        call createPage function to render content based on the new url */

  navigateTo (url) {
    this.changeURL(url);
    this.createPage();
  }

  /*  changeURL: change window url without navigating to it */
  changeURL (url) {
    window.history.pushState(null, null, url);
  }
};

function debounce (time, func) {
  let timer;
  return function (event) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(func, time, event);
  };
}
