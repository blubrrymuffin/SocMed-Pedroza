$(document).ready(function() {
    let commentInput;

    $('.feeds-content').on('click', '#comment-btn', function() {
        commentInput = $(this).siblings('input[type="text"]');
        let commentText = commentInput.val().trim();
        let postId = $(this).closest('.post-container').find('#postId').val();
        let userId = localStorage.getItem("id");
        let friendId = $(this).closest('.post-container').find('#userId').val();

        if (commentText !== '') {
            addComment(userId, friendId, postId, commentText);
        }
    });

    function addComment(userId, friendId, postId, commentText) {
        $.ajax({
            url: "./php/addComment.php",
            type: "POST",
            data: {
                user_id: userId,
                friend_id: friendId,
                postId: postId,
                comment: commentText
            },
            success: function(data) {
                let result = JSON.parse(data);
                if (result.res === "success") {
                    alert("Comment added successfully.");
                    commentInput.val('');
                } else {
                    alert(result.message);
                }
            },
            error: function() {
                alert("Error adding comment.");
            }
        });
    }

    $('.feeds-content').on('click', '.open-comment-modal', function() {
        let postId = $(this).closest('.post-container').find('#postId').val();
        fetchComments(postId);
        $('#commentModal').css('display', 'block');
    });

    $('.close').click(function() {
        $('#commentModal').css('display', 'none');
    });

    $(window).click(function(event) {
        if (event.target.id === 'commentModal') {
            $('#commentModal').css('display', 'none');
        }
    });

    function fetchComments(postId) {
        $.ajax({
            url: "php/fetchComments.php",
            type: "POST",
            data: { postId: postId },
            success: function(data) {
                let comments = JSON.parse(data);
                let commentsContainer = $('#commentModal .comments-container');
                commentsContainer.empty();

                let userId = localStorage.getItem("id");

                comments.forEach(comment => {
                    let commentDiv = document.createElement('div');
                    commentDiv.classList.add("comment-container");
                    let commentText = document.createElement('p');
                    commentText.textContent = `${comment.userName}: ${comment.comment}`;
                    commentDiv.appendChild(commentText);

                    if (comment.user_id == userId) {
                        let editBtn = document.createElement('button');
                        editBtn.classList.add("comment-edit");
                        editBtn.textContent = 'Edit';
                        editBtn.addEventListener('click', function() {
                            let editTextarea = document.createElement('textarea');
                            editTextarea.value = comment.comment;
                            commentDiv.replaceChild(editTextarea, commentText);

                            let submitBtn = document.createElement('button');
                            submitBtn.textContent = 'Submit';
                            submitBtn.addEventListener('click', function() {
                                let updatedComment = editTextarea.value;
                                updateComment(comment.id, updatedComment);
                            });
                            commentDiv.appendChild(submitBtn);

                            commentDiv.removeChild(editBtn);
                        });
                        commentDiv.appendChild(editBtn);

                        let deleteBtn = document.createElement('button');
                        deleteBtn.textContent = 'Delete';
                        deleteBtn.addEventListener('click', function() {
                            deleteComment(comment.id);
                        });
                        commentDiv.appendChild(deleteBtn);
                    }

                    commentsContainer.append(commentDiv);
                });
            },
            error: function() {
                alert("Error fetching comments.");
            }
        });
    }

    function deleteComment(commentId) {
        $.ajax({
            url: "php/deleteComment.php",
            type: "POST",
            data: { commentId: commentId },
            success: function(data) {
                alert("Comment deleted successfully.");
                fetchComments($('#postId').val());
            },
            error: function() {
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
            success: function(data) {
                alert("Comment updated successfully.");
                $('#commentModal').css('display', 'none');
                fetchComments($('#postId').val());
            },
            error: function() {
                alert("Error updating comment.");
            }
        });
    }
});
