const characterFolder = "Images/Characters/";

window.onload = constructor();

function constructor() {
    setTimeout(function() {

        var character = JSON.parse(sessionStorage.getItem("info"));

        document.getElementById("CharacterImage").src = characterFolder + character.name + ".png";
    }, 1000);
}

function goBack()
{
    window.history.back();
}