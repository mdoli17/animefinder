async function getJSONData(str)
{
    const response = await fetch(str, {mode: "cors"});
    const data = await response.json();
    return data;
}


window.onload = function () {
    
    var AnimeURL = localStorage.getItem("CharacterFilms");
    var data = getJSONData(AnimeURL);
    data.then((value) => {
        document.getElementById("Title").innerHTML = value.title;
        document.getElementById("Description").innerHTML = value.description;
        document.getElementById("Director").innerHTML = value.director;
        document.getElementById("Producer").innerHTML = value.producer;
        document.getElementById("Release").innerHTML = value.release_date;
        document.getElementById("Score").innerHTML = value.rt_score;
        document.getElementById("Image").src = "Images/Films/" + value.title + ".png";
        document.body.style.backgroundImage = "url('Images/Films/" + value.title + "_Background.png')";
    });
}