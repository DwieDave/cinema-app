
const CinemasPage = require('./pages/Cinemas');
const HomePage = require('./pages/Home');
const PresentationsPage = require('./pages/Presentations');
const TicketPage = require('./pages/Ticket');

// ----------------------------------------------

/*  document DOMContentLoaded:
    Main Function of Application */

document.addEventListener('DOMContentLoaded', function () {
  if (window.location.search && window.location.search !== '') {
    const redirectPath = decodeURIComponent(window.location.search.replace(/[?=]/g, '').replace('redirect', ''));
    if (redirectPath[0] === '/') navigateTo(redirectPath);
    console.log(redirectPath, redirectPath[0]);
  }

  // general click-handling
  document.addEventListener('click', function (event) {
    if (event.target.matches('.modeSelection')) {
      // Mode selection
      const mode = event.target.matches('.owner') ? 'owner' : 'customer';
      setMode(mode);
      navigateTo('/');
    } else if (event.target.matches('[data-routerLink]')) {
      // Router Link Handling:
      // prevent default link following (would try to open directory /page/cinemas for example)
      event.preventDefault();
      // instead navigate with own routing function
      navigateTo(event.target.href);
    }
  }, false);

  // Router initializing
  pageRouter();
});

/* window DOMContentLoaded: Set saved mode after loading Page */

window.addEventListener('DOMContentLoaded', function () {
  const mode = window.localStorage.getItem('mode');
  if (mode && mode !== '') setMode(mode);
  else setMode('customer');
});

// ----------------------------------------------

/*  pageRouter: Handles Routes and Pages  */

async function pageRouter () {
  const pages = [
    { path: '/', viewClass: HomePage },
    { path: '/page/ticket', viewClass: TicketPage },
    { path: '/page/cinemas', viewClass: CinemasPage },
    { path: '/page/presentations', viewClass: PresentationsPage }
  ];
  const page = findPage(pages);

  // Render Page
  if (page) await renderPage(page);
  // TODO: else: render Error Page
}

/*  renderPage: Creates a Page Class according to the viewClass property of the RouterPage
    Renders HTML content of class and registers clickHandlers of the class if given
    removes/adds ui-kits active class to the menu-entry linking to the current page */

async function renderPage (routerPage) {
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
    appContainer.offsetHeight = ((element) => {
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

function navigateTo (url) {
  window.history.pushState(null, null, url);
  pageRouter();
}

/* findPage: finds page from router Pages array that matches the current location pathname */

function findPage (pages) {
  if (pages?.length > 0) {
    for (const page of pages) {
      const routeRegex = new RegExp('^' + page.path.replace(/\//g, '\\/') + '$');
      if (window.location.pathname.match(routeRegex) !== null) return page;
    }
    return null;
  }
}

// ----------------------------------------------

/*  setMode: Change menu and button styles to display owner or customer menu
    save set mode in localStorage */

function setMode (mode) {
  window.localStorage.setItem('mode', mode);
  if (mode === 'customer') {
    document.querySelector('#menuCustomer').style.display = 'flex';
    document.querySelector('#menuOwner').style.display = 'none';
    document.querySelector('.customer').classList.add('uk-button-primary');
    document.querySelector('.owner').classList.remove('uk-button-primary');
  } else {
    document.querySelector('#menuOwner').style.display = 'flex';
    document.querySelector('#menuCustomer').style.display = 'none';
    document.querySelector('.customer').classList.remove('uk-button-primary');
    document.querySelector('.owner').classList.add('uk-button-primary');
  }
}
