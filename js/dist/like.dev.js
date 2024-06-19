"use strict";

$(document).ready(function () {
  $(document).on('click', '#toggleLike', function () {
    var status = "like on your post";
    var postId = $(this).closest('.post-container').find('#postId').val();
    var userId = localStorage.getItem("id");
    var friendId = $(this).closest('.post-container').find('#userId').val();
    likePost(userId, postId, friendId, status);
  });
  $('#notification').click(function () {
    console.log("hoy");
    $.ajax({
      url: 'php/fetchLikePost.php',
      type: 'GET',
      dataType: 'json',
      success: function success(response) {
        console.log(response);

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

function likePost(userId, postId, friendId, status) {
  console.log(userId);
  console.log(friendId);
  console.log(postId);
  console.log(status);
  $.ajax({
    url: "php/likePost.php",
    type: "POST",
    data: {
      user_id: userId,
      friend_id: friendId,
      post_id: postId,
      status: status
    },
    success: function success(data) {
      var result = JSON.parse(data);

      if (result.res === "success") {
        alert("Like Post");
      } else {
        alert(result.message);
      }
    }
  });
}