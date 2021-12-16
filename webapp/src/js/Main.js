document.addEventListener('click', function (event) {
  if (!event.target.matches('.modeSelection')) return;
  const mode = event.target.matches('.owner') ? 'owner' : 'customer';
  setMode(mode);
}, false);

window.addEventListener('DOMContentLoaded', (event) => {
  const mode = window.localStorage.getItem('mode');
  if (mode && mode !== '') setMode(mode);
  else setMode('customer');
});

function setMode (mode) {
  window.localStorage.setItem('mode', mode);
  if (mode === 'customer') {
    document.querySelector('#contentCustomer').style.display = 'block';
    document.querySelector('#contentOwner').style.display = 'none';
    document.querySelector('.customer').classList.add('uk-button-primary');
    document.querySelector('.owner').classList.remove('uk-button-primary');
  } else {
    document.querySelector('#contentOwner').style.display = 'block';
    document.querySelector('#contentCustomer').style.display = 'none';
    document.querySelector('.customer').classList.remove('uk-button-primary');
    document.querySelector('.owner').classList.add('uk-button-primary');
  }
}
