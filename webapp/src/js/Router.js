const CinemasPage = require('./pages/Cinemas');
const ErrorPage = require('./pages/ErrorPage');
const HomePage = require('./pages/Home');
const PresentationsPage = require('./pages/Presentations');
const TicketPage = require('./pages/Ticket');

/*  Router: Handles Routes and Pages  */
module.exports = class Router {
  constructor() {
    // Pages-Array assigns URL-path to Page-Class
    this.pages = [
      { path: '/', pageClass: HomePage },
      { path: '/page/ticket', pageClass: TicketPage },
      { path: '/page/cinemas', pageClass: CinemasPage },
      { path: '/page/presentations', pageClass: PresentationsPage }
    ];

    // Array for registered Listeners [needed to remove them at some point]
    this.registeredListeners = [];

    // Navigate to requested page if redirect-URL is present
    if (window.location.search && window.location.search !== '') {
      const redirectPath = decodeURIComponent(window.location.search.replace(/[?=]/g, '').replace('redirect', ''));
      if (redirectPath[0] === '/') this.navigateTo(redirectPath);
      console.log(redirectPath, redirectPath[0]);
    } else {
      this.createPage();
    }

    // RouterLinkListener Function
    this.routerLinkListener = (event) => {
      if (!event.target.matches('[data-routerLink]')) return;
      // Router Link Handling:
      // prevent default link following (would try to open directory /page/cinemas for example)
      event.preventDefault();
      // instead navigate with own routing function
      this.navigateTo(event.target.href);
    };
  }


  /* createPage: creates the instance of a page registered with its class in the pages array
     also handles the routerlinkclickhandler after page rendering as well as error page creation
  */
  async createPage() {
    const page = this.findPage(window.location.pathname);
    if (page) {
      // creating class
      const PageClass = (page.pageClass);
      this.page = new PageClass({ Router: this });
      this.routerpage = page;
      await this.renderPage(page);
      // add click handler for router links after page is rendered to also target
      // routerlinks in page template
      this.addRouterLinkClickHandler();
    } else {
      this.page = new ErrorPage(404, 'Seite nicht gefunden.');
      await this.renderPage({ path: '/error', pageClass: ErrorPage });
      this.changeURL('/error');
    }
  }

  /* addRouterLinkClickHandler: 1st removes clickHandler (if exists) then re-adds it */
  addRouterLinkClickHandler() {
    document.removeEventListener('click', this.routerLinkListener);
    document.addEventListener('click', this.routerLinkListener, false);
  }

  /* findPage: finds page from router Pages array that matches the current location pathname */
  findPage(urlpath) {
    if (this.pages?.length > 0) {
      for (const page of this.pages) {
        const routeRegex = new RegExp('^' + page.path.replace(/\//g, '\\/') + '$');
        if (urlpath.match(routeRegex) !== null) return page;
      }
      return null;
    }
  }

  /* renderPage: Creates a Page Class according to the pageClass property of the RouterPage
     Renders HTML content of class and registers clickHandlers of the class if given
     removes/adds ui-kits active class to the menu-entry linking to the current page */
  async renderPage(options) {
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

  /* navigateTo: "soft navigate" to url
        call createPage function to render content based on the new url */
  navigateTo(url) {
    if (url !== window.location.href) {
      this.changeURL(url);
      this.createPage();
    }
  }

  /* changeURL: change window url without navigating to it */
  changeURL(url) {
    console.log('changes history to:', url);
    window.history.pushState(null, null, url);
  }
};

// debounce: debounces function with a timer to ensure 
// resize function is only called every x-time and not EVERYTIME
function debounce(time, func) {
  let timer;
  return function (event) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(func, time, event);
  };
}
