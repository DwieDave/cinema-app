const Router = require('./Router');
// ----------------------------------------------

/*  document DOMContentLoaded:
    Main Function of Application */

document.addEventListener('DOMContentLoaded', function () {
  // Router initializing
  const router = new Router();

  if (window.location.search && window.location.search !== '') {
    const redirectPath = decodeURIComponent(window.location.search.replace(/[?=]/g, '').replace('redirect', ''));
    if (redirectPath[0] === '/') router.navigateTo(redirectPath);
    console.log(redirectPath, redirectPath[0]);
  }

  // click-handling
  document.addEventListener('click', function (event) {
    if (event.target.matches('.modeSelection')) {
      // Mode selection
      const mode = event.target.matches('.owner') ? 'owner' : 'customer';
      setMode(mode);
      router.navigateTo('/');
    } else if (event.target.matches('[data-routerLink]')) {
      // Router Link Handling:
      // prevent default link following (would try to open directory /page/cinemas for example)
      event.preventDefault();
      // instead navigate with own routing function
      router.navigateTo(event.target.href);
    }
  }, false);
});

/* window DOMContentLoaded: Set saved mode after loading Page */

window.addEventListener('DOMContentLoaded', function () {
  const mode = window.localStorage.getItem('mode');
  if (mode && mode !== '') setMode(mode);
  else setMode('customer');
});

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
