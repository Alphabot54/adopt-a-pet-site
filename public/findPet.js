document.getElementById('findPetForm').addEventListener("submit", function(event) {
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
    

    if(!isValid) {
        event.preventDefault();
        alert('Invalid form submission!');
    }
    else {
        alert('Submission accepted');
    }
});