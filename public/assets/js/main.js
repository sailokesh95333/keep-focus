$(document).ready(function() {
  // set interval to refresh timer
  updateInfo();
  setInterval(() => updateInfo(), 1000*15);

  function updateInfo() {
    fetchStatus().then(status => {
      // update remaining time
      $('#remaining__time').text(status.remainingTime);

      // update punishment
      $('#total__amount').text(status.totalAmount);
      $('#current__amount').text(status.currentAmount);

      // update focus goals
      status.focus.forEach(item => {
        $(`#focus-${item.id} .task__goal__reached`).text(item.done);
        $(`#focus-${item.id} .task__goal__time`).text(item.finishedBefore);
      });

      // update habit goals
      status.habits.forEach(item => {
        $(`#habit-${item.id} .task__goal__reached`).text(item.done);
        $(`#habit-${item.id} .task__goal__time`).text(item.finishedBefore);
      });
    });
  }
});