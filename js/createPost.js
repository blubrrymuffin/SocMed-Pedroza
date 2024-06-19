document.addEventListener('DOMContentLoaded', function() {
    var images = [];

    var postImageInput = document.getElementById("postImage");
    var createPostButton = document.getElementById("create-post");

    if (postImageInput) {
        postImageInput.addEventListener("change", function(e) {
            images = e.target.files;
        });
    }

    if (createPostButton) {
        createPostButton.addEventListener("click", function(e) {
            e.preventDefault();

            var formData = new FormData();
            formData.append('post', true);
            formData.append('poster_id', document.getElementById("userId").value);
            formData.append('caption', document.getElementById("get-text").value);

            for (let i = 0; i < images.length; i++) {
                formData.append('postImage[]', images[i]);
            }

            $.ajax({
                url: "php/addPost.php",
                method: "POST",
                data: formData,
                contentType: false,
                processData: false,
                success: function(data) {
                    alert('Post added successfully!');
                    document.getElementById("addPost").reset();

                    // Fetch and display posts immediately after adding a new post
                    fetchAndDisplayPosts(); // Assuming you have a function to fetch and display posts
                },
                error: function(error) {
                    console.error('Error adding post:', error);
                    alert('There was an error adding your post. Please try again.');
                }
            });
        });
    }
});

// Function to fetch and display posts

function fetchAndDisplayPosts() {
    $.ajax({
        url: 'php/fetchPosts.php', // Adjust URL according to your server setup
        type: 'GET',
        dataType: 'json', // Expect JSON response
        success: function(posts) {
            $('.feeds').empty(); // Clear existing posts

            if (posts && posts.length > 0) {
                posts.forEach(function(post) {
                    var template = $('.poster-template').clone();
                    template.find('.avatar').attr('src', 'php/' + post.image);
                    template.find('.username').text(post.username);
                    template.find('.poster-name').text(post.name);
                    template.find('.poster-time').text(post.time);
                    template.find('.display-caption').text(post.caption);
                    // Add logic to display images, likes, comments, etc.

                    $('.feeds').append(template.html());
                });
            } else {
                // Handle case where no posts are returned
                $('.feeds').append('<p>No posts available.</p>');
            }
        },
        error: function(xhr, status, error) {
            console.error('Error fetching posts:', error);
            // Display error message or handle error gracefully
            $('.feeds').empty().append('<p>Error fetching posts. Please try again later.</p>');
        }
    });
}


$(document).on('click', '#post-edit', function() {
    var postId = $(this).closest('.post-container').find('#postId').val();
    var userId = $(this).closest('.post-container').find('#userId').val();
    var caption = $(this).closest('.post-container').find('.display-caption').text();

    // Store data in localStorage to access it in the edit form
    localStorage.setItem('editPostId', postId);
    localStorage.setItem('editUserId', userId);
    localStorage.setItem('editCaption', caption);

    // Open the edit form in another file
    window.location.href = 'editPost.html';
});

document.getElementById('see-profile').addEventListener('click', () => {
    window.location.href = 'profile.html';
});

var id = localStorage.getItem("id");
var name = localStorage.getItem("name");
var username = localStorage.getItem('username');
var image = localStorage.getItem('image');
if (!name) {    
    window.location.href = "index.html"; 
} else {
    var firstName = name.split(" ").slice(0, -1).join(" ");
    document.getElementById("fullname").textContent = name;
    document.getElementById("anotherName").textContent = firstName;
    document.getElementById("profile-image").src = "php/" + image;
    document.getElementById("name-avatar").src = "php/" + image;
    document.getElementById("poster-image").src = "php/" + image;
}
