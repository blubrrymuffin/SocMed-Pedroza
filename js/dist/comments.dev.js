"use strict";

$(document).ready(function () {
  var commentInput;
  $('.feeds-content').on('click', '#comment-btn', function () {
    commentInput = $(this).siblings('input[type="text"]');
    var commentText = commentInput.val().trim();
    var postId = $(this).closest('.post-container').find('#postId').val();
    var userId = localStorage.getItem("id");
    var friendId = $(this).closest('.post-container').find('#userId').val();

    if (commentText !== '') {
      addComment(userId, friendId, postId, commentText);
      likePost(userId, postId, friendId, "commented on your post");
    }
  }); // Function to add a comment

  function addComment(userId, friendId, postId, commentText) {
    $.ajax({
      url: "php/addComment.php",
      type: "POST",
      data: {
        user_id: userId,
        friend_id: friendId,
        postId: postId,
        comment: commentText
      },
      success: function success(data) {
        var result = JSON.parse(data);

        if (result.res === "success") {
          alert("Comment added successfully."); // Clear the input field

          commentInput.val('');
        } else {
          alert(result.message);
        }
      },
      error: function error() {
        alert("Error adding comment.");
      }
    });
  }
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

$(document).ready(function () {
  // Open comment modal and fetch comments
  $('.feeds-content').on('click', '.open-comment-modal', function () {
    var postId = $(this).closest('.post-container').find('#postId').val();
    fetchComments(postId);
    $('#commentModal').css('display', 'block');
  }); // Close the comment modal when clicking on the close button

  $('.close').click(function () {
    $('#commentModal').css('display', 'none');
  }); // Close the comment modal when clicking outside the modal

  $(window).click(function (event) {
    if (event.target.id === 'commentModal') {
      $('#commentModal').css('display', 'none');
    }
  }); // Function to fetch comments for a post

  function fetchComments(postId) {
    $.ajax({
      url: "php/fetchComments.php",
      type: "POST",
      data: {
        postId: postId
      },
      success: function success(data) {
        var comments = JSON.parse(data);
        var commentsContainer = $('#commentModal .comments-container');
        commentsContainer.empty();
        var userId = localStorage.getItem("id");
        comments.forEach(function (comment) {
          var commentDiv = document.createElement('div');
          commentDiv.classList.add("comment-container");
          var commentText = document.createElement('p');
          commentDiv.innerHTML = "<strong>".concat(comment.userName, "</strong>: ").concat(comment.comment);
          commentDiv.appendChild(commentText);

          if (comment.user_id == userId) {
            // Use '==' for loose comparison
            var editBtn = document.createElement('button');
            editBtn.classList.add("comment-edit");
            editBtn.textContent = 'Edit';
            editBtn.addEventListener('click', function () {
              // Create a textarea for editing
              var editTextarea = document.createElement('textarea');
              editTextarea.value = comment.comment;
              commentDiv.replaceChild(editTextarea, commentText); // Create a submit button

              var submitBtn = document.createElement('button');
              submitBtn.textContent = 'Submit';
              submitBtn.addEventListener('click', function () {
                var updatedComment = editTextarea.value;
                updateComment(comment.id, updatedComment);
              });
              commentDiv.appendChild(submitBtn); // Remove the edit button

              commentDiv.removeChild(editBtn);
            });
            commentDiv.appendChild(editBtn);
            var deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', function () {
              // Handle delete comment
              deleteComment(comment.id);
            });
            commentDiv.appendChild(deleteBtn);
          }

          commentsContainer.append(commentDiv);
        });
      },
      error: function error() {
        alert("Error fetching comments.");
      }
    });
  } // Function to delete a comment


  function deleteComment(commentId) {
    $.ajax({
      url: "php/deleteComment.php",
      type: "POST",
      data: {
        commentId: commentId
      },
      success: function success(data) {
        alert("Comment deleted successfully.");
        window.location.reload();
      },
      error: function error() {
        alert("Error deleting comment.");
      }
    });
  }

  function updateComment(commentId, updatedComment) {
    $.ajax({
      url: "php/updateComment.php",
      type: "POST",
      data: {
        commentId: commentId,
        updatedComment: updatedComment
      },
      success: function success(data) {
        alert("Comment updated successfully.");
        $('#editCommentModal').css('display', 'none');
        window.location.reload();
      },
      error: function error() {
        alert("Error updating comment.");
      }
    });
  }
});