document.getElementById('givePetForm').addEventListener("submit", function(event) {
    let isValid = true;

    let animalChoice = document.querySelector('input[name="animalChoice"]:checked');
    if (!animalChoice) {
        isValid = false;
    } else {
        animalChoice = animalChoice.value;
    }

    let animalBreed = document.getElementById('animalBreed').value;
    if(animalBreed == "") {
        isValid = false;
    }

    let animalAge = document.getElementById('animalAge').value;
    if(animalAge == "") {
        isValid = false;
    }

    let genderChoice = document.querySelector('input[name="genderChoice"]:checked');
    if (!genderChoice) {
        isValid = false;
    } else {
        genderChoice = genderChoice.value;
    }

    let getAlongWith = document.querySelectorAll('input[name="getAlongWith[]"]:checked');
    let selectedValues = [];
    getAlongWith.forEach(checkbox => selectedValues.push(checkbox.value));

    let comments = document.getElementById('comments').value;

    let animalName = document.getElementById('animalName').value;
    if(animalName == "") {
        isValid = false;
    }

    let ownerFirstName = document.getElementById('ownerFirstName').value;
    if(ownerFirstName == "") {
        isValid = false;
    }

    let ownerLastName = document.getElementById('ownerLastName').value;
    if(ownerLastName == "") {
        isValid = false;
    }

    let email = document.getElementById('email').value;
    let emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if(!emailPattern.test(email)) {
        isValid = false;
    }



    if(!isValid) {
        event.preventDefault();
        alert('Invalid form submission!');
    }
    else {
        alert('Submission accepted');
    }
});