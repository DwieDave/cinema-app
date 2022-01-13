const Application = require('./App');
// ----------------------------------------------

/*  document DOMContentLoaded:
    Main Function of Cinema-App */

document.addEventListener('DOMContentLoaded', () => {
  // Closure workaround because of semistandard linting
  (() => { return new Application(); })();
});
