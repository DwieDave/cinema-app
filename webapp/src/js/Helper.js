function formatDate (dateString) {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: '2-digit', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return date.toLocaleDateString('de-DE', options);
}
module.exports = { formatDate };
