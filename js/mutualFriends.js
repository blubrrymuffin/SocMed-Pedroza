$(document).ready(function() {
    var loggedInUserId = localStorage.getItem("id");
    // Fetch friends data from PHP script
    $.ajax({
        url: 'php/fetchFriends.php',
        type: 'GET',
        success: function(response) {
            // Parse JSON response
            var friends = JSON.parse(response);
            console.log(friends);
            friends.forEach(function(nestedArray) {
                nestedArray.forEach(function(friend) {
                    // Skip adding the current user to the friend list
                    if (friend.id !== loggedInUserId) {
                        var template = document.getElementById('friends-template');
                        var clone = template.content.cloneNode(true);

                        // clone.querySelector('.friends-image').src = friend.avatar_url;   
                        clone.querySelector('#friends-name').textContent = friend.name; 

                        var button = clone.querySelector('button');
                        button.addEventListener('click', function() {
                            // Get the friend's ID
                            var friendId = friend.id;
                            console.log('Friend ID:', friendId);

                            // Send AJAX request to remove friend
                            $.ajax({
                                url: 'php/removeFriend.php',
                                type: 'POST',
                                data: { friendId: friendId },
                                success: function(response) {
                                    console.log('Friend removed successfully');
                                    // button.parentNode.remove(); 
                                    window.location.reload();
                                },
                                error: function(xhr, status, error) {
                                    console.error('Failed to remove friend:', error);
                                }
                            });
                        });

                        document.querySelector('.friend-list-container').appendChild(clone);
                    }
                });
            });
        },
        error: function(xhr, status, error) {
            console.error(error);
        }
    });
});