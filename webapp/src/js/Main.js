
import CinemasView from './pages/Cinemas';
import HomeView from './pages/Home';
import PresentationsView from './pages/Presentations';
import TicketView from './pages/Ticket';

async function pageRouter () {
  const pages = [
    { path: '/', viewClass: HomeView },
    { path: '/page/ticket', viewClass: TicketView },
    { path: '/page/cinemas', viewClass: CinemasView },
    { path: '/page/presentations', viewClass: PresentationsView }
  ];
  const page = findPage(pages);

  // Render Page
  await renderPage(page);
}

async function renderPage (routerPage) {
  const PageClass = (routerPage.viewClass);
  const page = new PageClass();
  document.querySelector('#app').innerHTML = await page.render();

  const clickHandlers = page.clickHandler;
  if (clickHandlers?.length > 0) {
    for (const clickHandler of clickHandlers) {
      page.registerClickHandler(clickHandler.querySelector, clickHandler.callback);
    }
  }

  const mode = window.localStorage.getItem('mode');
  const menu = document.querySelector('#menu' + mode[0].toUpperCase() + mode.slice(1));

  for (let i = 0; i < menu.children.length; i++) {
    const child = menu.children[i];
    child.classList.remove('uk-active');
    if (child.children[0].attributes.href.value === routerPage.path) child.classList.add('uk-active');
  }
}

function navigateTo (url) {
  window.history.pushState(null, null, url);
  pageRouter();
}

function findPage (pages) {
  if (pages?.length > 0) {
    for (const page of pages) {
      const routeRegex = new RegExp('^' + page.path.replace(/\//g, '\\/') + '$');
      if (window.location.pathname.match(routeRegex) !== null) return page;
    }
    return null;
  }
}

function setMode (mode) {
  window.localStorage.setItem('mode', mode);
  if (mode === 'customer') {
    // document.querySelector('#contentCustomer').style.display = 'block';
    // document.querySelector('#contentOwner').style.display = 'none';
    document.querySelector('#menuCustomer').style.display = 'flex';
    document.querySelector('#menuOwner').style.display = 'none';
    document.querySelector('.customer').classList.add('uk-button-primary');
    document.querySelector('.owner').classList.remove('uk-button-primary');
  } else {
    // document.querySelector('#contentOwner').style.display = 'block';
    // document.querySelector('#contentCustomer').style.display = 'none';
    document.querySelector('#menuOwner').style.display = 'flex';
    document.querySelector('#menuCustomer').style.display = 'none';
    document.querySelector('.customer').classList.remove('uk-button-primary');
    document.querySelector('.owner').classList.add('uk-button-primary');
  }
}

document.addEventListener('DOMContentLoaded', function () {
  if (window.location.search && window.location.search !== '') {
    const redirectPath = decodeURIComponent(window.location.search.replace(/[?=]/g, '').replace('redirect', ''));
    if (redirectPath[0] === '/') navigateTo(redirectPath);
    console.log(redirectPath, redirectPath[0]);
  }

  // ClickHandling
  document.addEventListener('click', function (event) {
    if (event.target.matches('.modeSelection')) {
      // Mode Change
      const mode = event.target.matches('.owner') ? 'owner' : 'customer';
      setMode(mode);
      navigateTo('/');
    } else if (event.target.matches('[data-routerLink]')) {
      // Link Handling
      event.preventDefault();
      navigateTo(event.target.href);
    }
  }, false);

  // Router initializing
  pageRouter();
});

window.addEventListener('DOMContentLoaded', function () {
  // Set saved Mode
  const mode = window.localStorage.getItem('mode');
  if (mode && mode !== '') setMode(mode);
  else setMode('customer');
});
