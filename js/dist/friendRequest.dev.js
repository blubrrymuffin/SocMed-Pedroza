"use strict";

var userId = localStorage.getItem("id");
document.getElementById('find-friend').addEventListener('click', function () {
  window.location.href = 'friends.html';
});

function fetchFriendRequests() {
  $.ajax({
    url: "php/friendRequest.php",
    type: "POST",
    data: {
      userId: userId
    },
    success: function success(data) {
      var requests = JSON.parse(data);
      var notificationContainer = document.querySelector('.notification');
      notificationContainer.innerHTML = '';
      requests.forEach(function (request) {
        if (request.status === 'Pending') {
          var requestDiv = document.createElement('div');
          requestDiv.classList.add('request');
          var senderId = request.id;
          var senderIdD = request.sender_id;
          var receiverId = request.receiver_id;
          var senderName = request.sender_name;
          var acceptButton = document.createElement('button');
          acceptButton.textContent = 'Accept';
          acceptButton.addEventListener('click', function () {
            // Handle accepting friend request
            acceptFriendRequest(senderId, receiverId, senderIdD);
          });
          var rejectButton = document.createElement('button');
          rejectButton.textContent = 'Reject';
          rejectButton.addEventListener('click', function () {
            // Handle rejecting friend request
            rejectFriendRequest(senderId, receiverId);
          });
          requestDiv.textContent = senderName + ' sent you a friend request.';
          requestDiv.appendChild(acceptButton);
          requestDiv.appendChild(rejectButton);
          notificationContainer.appendChild(requestDiv);
        }
      });
    },
    error: function error() {
      alert("Error fetching friend requests.");
    }
  });
}

$('#notification').click(function () {
  $('#notificationModal').css('display', 'block');
  fetchFriendRequests(); // alert("HELLO WORLD")
}); // Close the modal when clicking on the close button

$('.close').click(function () {
  $('#notificationModal').css('display', 'none');
}); // Close the modal when clicking outside the modal

$(window).click(function (event) {
  if (event.target.id === 'notificationModal') {
    $('#notificationModal').css('display', 'none');
  }
});

function acceptFriendRequest(senderId, receiverId, senderIdD) {
  $.ajax({
    url: "php/friendReqQuery.php",
    type: "POST",
    data: {
      senderId: senderId,
      senderIdD: senderIdD,
      receiverId: receiverId,
      status: 'Accepted'
    },
    success: function success(data) {
      // Handle success response
      alert("Friend request accepted.");
      $('#notificationModal').css('display', 'none');
      window.location.reload();
    },
    error: function error() {
      // Handle error response
      alert("Error accepting friend request.");
    }
  });
}

function rejectFriendRequest(senderId, receiverId) {
  $.ajax({
    url: "php/friendReqQuery.php",
    type: "POST",
    data: {
      senderId: senderId,
      receiverId: receiverId,
      status: 'Rejected'
    },
    success: function success(data) {
      // Handle success response
      alert("Friend request rejected.");
      $('#notificationModal').css('display', 'none');
      window.location.reload();
    },
    error: function error() {
      // Handle error response
      alert("Error rejecting friend request.");
    }
  });
}