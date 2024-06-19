$(document).ready(function() {

    $.ajax({
        url: "php/fetchPost.php",
        type: "GET",
        success: function(data) {
            let posts = JSON.parse(data);
            let template = document.querySelector('.poster-template');
            let container = document.querySelector('.feeds');

            posts.forEach(post => {
                let clone = template.content.cloneNode(true);
                clone.querySelector('#userId').value = post.user_id;
                clone.querySelector('#postId').value = post.id;
                clone.querySelector('.avatar').src = "php/" + post.image;
                clone.querySelector('.username').textContent = "@" + post.username;
                clone.querySelector('.poster-name').textContent = post.name;
                clone.querySelector('.display-caption').textContent = post.caption;
                clone.querySelector('.poster-time').textContent = timeAgo(post.time);

                let postImageDiv = clone.querySelector('.post-image');

                if (post.imagePost) {
                    let postImageImg = document.createElement('img');
                    postImageImg.className = 'post-image-img';
                    postImageImg.src = "php/" + post.imagePost;
                    
                    // Add error handling for image loading
                    postImageImg.onerror = function() {
                        this.style.display = 'none';
                    };
                    
                    postImageDiv.appendChild(postImageImg);
                }

                // Show or hide edit and delete buttons
                toggleEditDeleteButtons($(clone), post.user_id);

                container.appendChild(clone);
            });
        },
        error: function() {
            alert("Error fetching posts data.");
        }
    });

    // Function to check if the logged-in user is the poster
    function isPoster(userId) {
        var loggedInUserId = localStorage.getItem("id");
        return userId === loggedInUserId;
    }

    // Function to show or hide edit and delete buttons based on whether the logged-in user is the poster
    function toggleEditDeleteButtons(element, userId) {
        if (isPoster(userId)) {
            element.find('#post-edit').show(); // Show the edit button
            element.find('#post-delete').show(); // Show the delete button
        } else {
            element.find('#post-edit').hide(); // Hide the edit button
            element.find('#post-delete').hide(); // Hide the delete button
        }
    }

    // Function to format time ago
    function timeAgo(timestamp) {
        const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
        let interval = Math.floor(seconds / 31536000);
    
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

    // Event listener for post deletion
    $(document).on('click', '#post-delete', function() {
        var postId = $(this).closest('.post-container').find('#postId').val();

        if (confirm("Are you sure you want to delete this post?")) {
            $.ajax({
                url: "php/deletePost.php",
                type: "POST",
                data: { postId: postId },
                success: function(data) {
                    let result = JSON.parse(data);
                    if (result.res === "success") {
                        window.location.reload();
                    } else {
                        alert(result.message);
                    }
                },
                error: function() {
                    alert("Error deleting post.");
                }
            });
        }
    });

});
