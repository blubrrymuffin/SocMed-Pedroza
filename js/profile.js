const btnEdit = document.querySelector('.profile-edit');
    const modal = document.querySelector('.edit-modal');
    const btnClose = document.querySelector('.edit-modal-close');

    btnEdit.addEventListener('click', () => {
        modal.style.display = 'block';
    });

    btnClose.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    document.addEventListener('DOMContentLoaded', function() {
    var name = localStorage.getItem("name");
    var firstName = name.split(" ").slice(0, -1).join(" ");
    document.getElementById("name").textContent = firstName;
    document.getElementById("profile-name").textContent = name;
    document.getElementById("profile-username").textContent = "@" + localStorage.getItem("username");
    document.getElementById("profile-gender").textContent = localStorage.getItem("gender");
    document.getElementById("profile-location").textContent = localStorage.getItem("location");
    document.getElementById("profile-civil").textContent = localStorage.getItem("civilStatus");
    var birthdate = new Date(localStorage.getItem("birthdate"));
    var options = { year: 'numeric', month: 'long', day: 'numeric' };
    var formattedBirthdate = birthdate.toLocaleDateString('en-US', options);
    document.getElementById("profile-birthdate").textContent = formattedBirthdate;

    document.getElementById("fullName").value = name;
    document.getElementById("id").value = localStorage.getItem("id");
    document.getElementById("username").value = localStorage.getItem("username");
    document.getElementById("password").value = localStorage.getItem("password");
    document.getElementById("civilStatus").value = localStorage.getItem("civilStatus");
    document.getElementById("gender").value = localStorage.getItem("gender");
    document.getElementById("location").value = localStorage.getItem("location");
    document.getElementById("birthdate").value = localStorage.getItem("birthdate");

        var profileImage = localStorage.getItem("image");
        document.getElementById("profileImage").setAttribute("src", "php/" + profileImage);
        document.getElementById("previewImage").setAttribute("src", "php/" + profileImage);
        document.getElementById("imagePath").value = profileImage.replace("uploads/", "");


});

document.getElementById("image").addEventListener('change', function() {
    var file = this.files[0];
    if (file) {
        var reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById("editProfileImage").setAttribute("src", e.target.result);
        }
        reader.readAsDataURL(file);
    } else {
        var profileImage = localStorage.getItem("image");
        if (profileImage) {
            document.getElementById("editProfileImage").setAttribute("src", "php/" + profileImage);
           
        }
    }
});





