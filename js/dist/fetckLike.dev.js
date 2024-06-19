"use strict";

$(document).ready(function () {
  $('#notification').click(function () {
    $.ajax({
      url: 'php/fetchLikePost.php',
      type: 'GET',
      dataType: 'json',
      success: function success(response) {
        if (response.length > 0) {
          // Update notification modal with fetched notifications
          $('.notification').empty();
          response.forEach(function (notification) {
            $('.notification').append('<p>' + notification.message + '</p>');
          });
          $('#notificationModal').show();
        } else {
          alert('No notifications');
        }
      },
      error: function error(xhr, status, _error) {
        console.error(xhr.responseText);
      }
    });
  });
});