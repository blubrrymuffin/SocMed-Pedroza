"use strict";

$(document).ready(function () {
  $.ajax({
    url: "php/fetch.php",
    type: "GET",
    success: function success(data) {
      var people = JSON.parse(data);
      var template = document.querySelector('.people-card');
      var container = document.querySelector('.people');
      people.forEach(function (person) {
        var clone = template.content.cloneNode(true);
        clone.querySelector('.people-template-name').textContent = person.name;
        clone.querySelector('.people-template-username').textContent = "@" + person.username; // Set the image source

        if (person.image) {
          clone.querySelector('.people-template-image').setAttribute('src', 'php/' + person.image); // alert(person.image)
        }

        clone.querySelector('.btn button:first-of-type').setAttribute('data-person-id', person.id);
        container.appendChild(clone);
      });
    },
    error: function error() {
      alert("Error fetching people data.");
    }
  });
  var loggedInUserId = localStorage.getItem("id"); // Get the ID of the logged-in user
  // Function to check if the logged-in user is the poster

  function isPoster(userId) {
    return userId === loggedInUserId;
  } // Function to show or hide edit and delete buttons based on whether the logged-in user is the poster


  function toggleEditDeleteButtons(element, userId) {
    if (isPoster(userId)) {
      element.find('#post-edit').show(); // Show the edit button

      element.find('#post-delete').show(); // Show the delete button
    } else {
      element.find('#post-edit').hide(); // Hide the edit button

      element.find('#post-delete').hide(); // Hide the delete button
    }
  } // Fetch posts and display them


  $.ajax({
    url: "php/fetchPost.php",
    type: "GET",
    success: function success(data) {
      var people = JSON.parse(data);
      var template = document.querySelector('.poster-template');
      var container = document.querySelector('.feeds');
      people.forEach(function (person) {
        var clone = template.content.cloneNode(true);
        clone.querySelector('#userId').value = person.user_id;
        clone.querySelector('#postId').value = person.id;
        clone.querySelector('.avatar').src = "php/" + person.image;
        clone.querySelector('.username').textContent = "@" + person.username;
        clone.querySelector('.poster-name').textContent = person.name;
        clone.querySelector('.display-caption').textContent = person.caption;
        clone.querySelector('.poster-time').textContent = timeAgo(person.time);
        var postImageDiv = clone.querySelector('.post-image');

        if (person.imagePost) {
          var postImageImg = document.createElement('img');
          postImageImg.className = 'post-image-img';
          postImageImg.src = "php/" + person.imagePost; // Add onerror event handler

          postImageImg.onerror = function () {
            this.style.display = 'none';
          };

          postImageDiv.appendChild(postImageImg);
        } // Show or hide edit and delete buttons


        toggleEditDeleteButtons($(clone), person.user_id);
        container.appendChild(clone);
      });
    },
    error: function error() {
      alert("Error fetching people data.");
    }
  }); // jQuery code for handling post deletion

  $(document).on('click', '#post-delete', function () {
    var postId = $(this).closest('.post-container').find('#postId').val(); // Confirm deletion

    if (confirm("Are you sure you want to delete this post?")) {
      // Send delete request to server
      $.ajax({
        url: "php/deletePost.php",
        type: "POST",
        data: {
          postId: postId
        },
        success: function success(data) {
          var result = JSON.parse(data);

          if (result.res === "success") {
            window.location.reload();
          } else {
            alert(result.message);
          }
        },
        error: function error() {
          alert("Error deleting post.");
        }
      });
    }
  });
  $("#registrationForm").submit(function (event) {
    event.preventDefault();
    var name = $("#name").val();
    var username = $("#username").val();
    var password = $("#password").val();

    if (name.length > 0) {
      $.ajax({
        url: "php/register.php",
        type: "POST",
        data: {
          name: name,
          username: username,
          password: password
        },
        success: function success(data) {
          var result = JSON.parse(data);

          if (result.res === "success") {
            alert("Successfully Registered");
            window.location.href = "index.html";
          } else {
            alert(result.message);
          }
        },
        error: function error() {
          alert("Error registering user.");
        }
      });
    }
  });
  $("#loginForm").submit(function (event) {
    event.preventDefault();
    var username = $("#username").val();
    var password = $("#password").val();

    if (username.length > 0 && password.length > 0) {
      $.ajax({
        url: "php/login.php",
        type: "POST",
        data: {
          username: username,
          password: password
        },
        success: function success(data) {
          var result = JSON.parse(data);

          if (result.res === "success") {
            alert("Login successful");
            localStorage.setItem("id", result.id);
            localStorage.setItem("username", result.username);
            localStorage.setItem("name", result.name);
            localStorage.setItem("password", result.password);
            localStorage.setItem("gender", result.gender);
            localStorage.setItem("location", result.location);
            localStorage.setItem("civilStatus", result.civilStatus);
            localStorage.setItem("birthdate", result.birthdate);
            localStorage.setItem("image", result.image);
            window.location.href = "feeds.html";
          } else {
            alert(result.message);
          }
        },
        error: function error() {
          alert("Error logging in.");
        }
      });
    }
  });
}); // Logout

$("#logout").click(function () {
  $.ajax({
    url: "php/logout.php",
    type: "POST",
    success: function success(data) {
      var result = JSON.parse(data);

      if (result.res === "success") {
        localStorage.removeItem("name");
        window.location.href = "index.html";
      } else {
        alert(result.message);
      }
    },
    error: function error() {
      alert("Error logging out.");
    }
  });
});
document.querySelector('#editProfile').addEventListener('submit', function (event) {
  event.preventDefault();
  var id = document.getElementById('id').value;
  var username = document.getElementById('username').value;
  var password = document.getElementById('password').value;
  var name = document.getElementById('fullName').value;
  var gender = document.getElementById('gender').value;
  var location = document.getElementById('location').value;
  var civilStatus = document.getElementById('civilStatus').value;
  var birthdate = document.getElementById('birthdate').value;
  var image = document.getElementById('image').files[0];
  var formData = new FormData();
  formData.append('id', id);
  formData.append('username', username);
  formData.append('password', password);
  formData.append('name', name);
  formData.append('gender', gender);
  formData.append('location', location);
  formData.append('civilStatus', civilStatus);
  formData.append('birthdate', birthdate);
  formData.append('image', image);
  $.ajax({
    url: "php/update.php",
    type: "POST",
    data: formData,
    contentType: false,
    processData: false,
    success: function success(data) {
      var result = JSON.parse(data);

      if (result.res === "success") {
        alert("Profile updated successfully."); // Update the local storage with the new data

        localStorage.setItem("name", name);
        localStorage.setItem("gender", gender);
        localStorage.setItem("location", location);
        localStorage.setItem("civilStatus", civilStatus);
        localStorage.setItem("birthdate", birthdate);

        if (result.image) {
          localStorage.setItem("image", result.image); // Update the image in local storage

          document.getElementById("profileImage").setAttribute("src", "php/" + result.image); // Update the profile image
        }

        document.getElementById("name").textContent = name.split(" ").slice(0, -1).join(" ");
        document.getElementById("profile-name").textContent = name;
        document.getElementById("profile-username").textContent = "@" + username;
        document.getElementById("profile-gender").textContent = gender;
        document.getElementById("profile-location").textContent = location;
        document.getElementById("profile-civil").textContent = civilStatus;
        document.getElementById("profile-birthdate").textContent = birthdate;
        window.location.reload();
      } else {
        alert(result.message);
      }
    }
  });
}); // ADD FRIENDS

function addFriend(personId) {
  $.ajax({
    url: "php/addFriend.php",
    type: "POST",
    data: {
      personId: personId,
      userId: localStorage.getItem("id")
    },
    success: function success(data) {
      var result = JSON.parse(data);

      if (result.res === "success") {
        alert("Friend added successfully.");
        window.location.reload();
      } else {
        alert(result.message);
      }
    },
    error: function error() {
      alert("Error adding friend.");
    }
  });
}

function timeAgo(timestamp) {
  var seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
  var interval = Math.floor(seconds / 31536000);

  if (interval >= 1) {
    return interval + (interval === 1 ? " year ago" : " years ago");
  }

  interval = Math.floor(seconds / 2592000);

  if (interval >= 1) {
    return interval + (interval === 1 ? " month ago" : " months ago");
  }

  interval = Math.floor(seconds / 86400);

  if (interval >= 1) {
    return interval + (interval === 1 ? " day ago" : " days ago");
  }

  interval = Math.floor(seconds / 3600);

  if (interval >= 1) {
    return interval + (interval === 1 ? " hour ago" : " hours ago");
  }

  interval = Math.floor(seconds / 60);

  if (interval >= 1) {
    return interval + (interval === 1 ? " minute ago" : " minutes ago");
  }

  return Math.floor(seconds) + " seconds ago";
}