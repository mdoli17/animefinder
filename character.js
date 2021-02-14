const characterFolder = "Images/Characters/";

window.onload = constructor();

function constructor() {
    setTimeout(function() {

        var character = JSON.parse(sessionStorage.getItem("info"));

        document.getElementById("CharacterImage").src = characterFolder + character.name + ".png";
        document.getElementById("Name").innerHTML = "Name: " + character.name;
        document.getElementById("Gender").innerHTML = "Gender: " + character.gender;
        document.getElementById("Age").innerHTML = "Age: " + character.age;
        document.getElementById("EyeColor").innerHTML = "EyeColor: " + character.eye_color
        document.getElementById("HairColor").innerHTML = "HairColor: " + character.hair_color
    }, 1000);
}

function goBack()
{
    window.history.back();
}