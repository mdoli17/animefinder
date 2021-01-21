const characterFolder = "Images/Characters/";
async function getJSONData(str)
{
    const response = await fetch(str, {mode: "cors"});
    const data = await response.json();
    return data;
}


window.onload = constructor();

async function constructor()
{
    var AnimeURL = localStorage.getItem("CharacterFilms");
    var data = await getJSONData(AnimeURL);
    updateDetails(data);
    document.body.style.backgroundImage = "url('Images/Films/" + data.title + "_Background.png')";
    document.title = data.title;

    var characters = await getJSONData("https://ghibliapi.herokuapp.com/people");
    for(let i = 0; i < characters.length; i++)
    {
        let character = characters[i];
        let film = getJSONData(character.films[0]);
        film.then((v) => {
            if(v.title == data.title)
            {
                var imgdiv = document.createElement("div");
                imgdiv.setAttribute("class", "CharacterImageContainer");
                
                var img = new Image();
                img.src = characterFolder + character.name + ".png";
                img.setAttribute("class", "CharacterImage");
                img.onclick = function()
                {
                    alert(character.name);
                }
                
                
                imgdiv.appendChild(img);
                document.getElementById("CharacterContainer").appendChild(imgdiv);
            }
        });
    }
}

function updateDetails(value)
{
    document.getElementById("Title").innerHTML = value.title;
    document.getElementById("Description").innerHTML = value.description;
    document.getElementById("Director").innerHTML = value.director;
    document.getElementById("Producer").innerHTML = value.producer;
    document.getElementById("Release").innerHTML = value.release_date;
    document.getElementById("Score").innerHTML = value.rt_score;
    document.getElementById("Image").src = "Images/Films/" + value.title + ".png";
}
