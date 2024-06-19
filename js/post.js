$(document).ready(function(){

    images = []

    $("#addPost").on("submit", function(e) {
        e.preventDefault();
        
        var formData = new FormData();
        formData.append('post', true);
        formData.append('poster_id', $("#user_id").val());
        formData.append('caption', $("#caption").val());
     
        for (let i = 0; i < images.length; i++) {
            formData.append('imageInput[]', images[i]);
        }

        $.ajax({
            url: "/php/addPost.php",
            method: "POST",
            data: formData,
            contentType: false,
            processData: false,
            success: function(data) {
                alert(data);
                $("#addPost")[0].reset();
                window.location.href = "feeds.html";
            }
        });
    });

    $('#editPost').submit(function(event) {
        event.preventDefault();

        var formData = new FormData(this);
        var postId = getPostIdFromURL();

        formData.append('post_id', postId);
        formData.append('edit', true);

        for (let i = 0; i < images.length; i++) {
            formData.append('imageInputs[]', images[i]);
        }

        $.ajax({
            url: '/php/post.php',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {
                console.log(response); // Log server response to console
                window.location.href = "feeds.html";
            },
            error: function(xhr, status, error) {
                console.error(error); // Log and handle the error
                // Add error handling logic as needed (e.g., show error message to user)
            }
        });
    });

    // Function to extract postId from URL
    function getPostIdFromURL() {
        var urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id');
    }
    
    
    

    $(document).on('click', '.openComment', function(e){
        e.preventDefault();
        var postId = $(this).closest('.post-content').find('.post-id').val();
        window.location.href = `comment.html?id=${postId}`
    });

    $(document).on('click', '.clickable-heart', function(e){
        e.preventDefault();
        var postId = $(this).closest('.post-content').find('.post-id').val();
        
        $.ajax({
            url: '/php/likePost.php',
            method: 'POST',
            data: {likePost: true,postId: postId},
            success: function(response) {
                console.log(response)
                window.location.reload;
            },
        })
    });
    
    
    // SHOW MODAL
    $(document).on('click', '.editPost', function(e) {
        e.preventDefault();
        var postId = $(this).attr('data-post-id');
        $(".post_id_input").val(postId);
        // $(".edModal").css("display", "block");
        $(".edModal").toggle();
    });
    
    // EDIT POST

    $(document).on('click', '.edit-btn', function(e) {
        e.preventDefault();
        let postId = $(".post_id_input").val();
        window.location.href = `editPost.html?id=${postId}`;
    });

    // DELETE POST
    $(document).on('click', '.delete-btn', function(e) {
        e.preventDefault();
        let postId = $(".post_id_input").val();
        if (confirm('Are you sure you want to delete this post?')) {
            $.ajax({
                url: "/php/post.php",
                type: "POST",
                data: { deletePost: true, post_id: postId },
                success: function(response) {
                    var res = JSON.parse(response);
                    if (res.success) {
                    } else {
                        alert(res.message);
                    }
                },
                error: function(xhr, status, error) {
                    alert("An error occurred: " + error);
                }
            });
            window.location.reload();
        }

    });
    
    

});


 function getPostIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

function loadPostData(postId) {
    $.ajax({
        url: "/php/post.php",
        type: "GET",
        data: { post_id: postId },
        success: function(data) {
            console.log(data);
            if (data.length === 1) {
                const post = data[0];
                $("#caption").val(post.caption);
                let imageUrl = `../backend/php/${post.image}`;
                $('#inputImg').val(imageUrl.replace("../backend/php/", ""));
                $('#previewImage').css('background-image', `url("${imageUrl}")`);
                $('#imagePreview').attr('src', imageUrl);
            } else {
                console.error("Post not found or multiple posts returned.");
            }
        },
        error: function(xhr, status, error) {
            console.error("An error occurred: " + error);
        }
    });
}
function previewImage(event) {
    const preview = document.getElementById('previewImage');
    const files = event.target.files;  
    selectedFile(files)

    // Clear previous preview
    preview.innerHTML = '';

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();

        reader.onload = function(e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.style.maxWidth = '200px'; 
            preview.appendChild(img);
        }

        reader.readAsDataURL(file);
    }

    function selectedFile(files) {
        // Convert the FileList to an array and append it to the images array
        images = images.concat(Array.from(files));
    }

    // If there are files, set the input value to the path of the first file
    if (files.length > 0) {
        $('#inputImg').val("assets/post/" + files[0].name);
    } else {
        // If no files selected, clear the input value
        $('#inputImg').val(""); 
    }
}



$(document).ready(function() {
    const postId = getPostIdFromUrl();
    if (postId) {
        loadPostData(postId);
    } else {
        console.error("Post ID not found in URL.");
    }
});

// Function to navigate to editPost.html with post_id as a query parameter
function goto() {
    let postId = $('.post_id').val();
    window.location.href = "editPost.html?id=" + postId;
}
