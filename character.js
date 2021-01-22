const characterFolder = "Images/Characters/";

window.onload = constructor();

function constructor() {
    setTimeout(function() {
        console.log("AE");
        var character = JSON.parse(sessionStorage.getItem("info"));
        console.log(character.name);
        document.getElementById("CharacterImage").src = characterFolder + character.name + ".png";
    }, 1000);
}

function goBack()
{
    window.history.back();
}