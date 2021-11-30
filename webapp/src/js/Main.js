document.addEventListener('click', function (event) {
  if (!event.target.matches('#studiPlanerLogin')) return;
  setTimeout(() => {
    document.querySelector('#showWhenLoggedIn').style.display = 'block';
    document.querySelector('#navShowWhenLoggedIn').style.display = 'block';
    document.querySelector('#showWhenLoggedOut').style.display = 'none';
    event.target.style.display = 'none';
  }, 500);
}, false);
