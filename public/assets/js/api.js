var fetchStatus = function fetchStatus() {
  return fetch('api/status')
    .then(function(response) {
      return response.json();
    })
    .then(function(status) {
      return status;
    })
    .catch(err => console.log(err));
}