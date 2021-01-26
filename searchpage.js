
function capitalize(str)
{
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function ArrayRemove(array, str)
{
    var index = array.indexOf(str);
    if(index > -1)
        array.splice(index, 1);
}

function isNumber(str)
{
    return true;
}

const HomeURL = "https://ghibliapi.herokuapp.com/";
const WeatherURL = "https://api.openweathermap.org/data/2.5/weather?"
const characterFolder = "Images/Characters/";

async function getWeatherJSON(lat, lot)
{
    const response = await fetch(WeatherURL + "lat=" + lat + "&lon=" + lot +"&units=metric&appid=893f82ff52c071646ba64d7afeffa50b");
    const data = await response.json();
    return data;
}

async function getJSONData(str)
{
    const response = await fetch(HomeURL + str, {mode: "cors"});
    const data = await response.json();
    return data;
}




let eyeColors = ["Black", "Blue", "Brown", "Grey", "Green", "Hazel", "Red", "White", "Yellow", "Emerald"];
let hairColors = ["Black", "Blonde", "Brown", "Grey", "White", "Light", "Orange", "Beige"];

var enteredAttributes = [];

var CharacterIndex = 0;
var SelectedIndex = -1;
var CharacterArray = [];


window.onload = function() {
    document.getElementById("RightPanel").addEventListener('wheel', function(event)
    {
        wheelTurned(event);
    });
    updateTime();
    updateWeather();
}


let CharacterAttributeJSON = {
    name: "",
    age: "",
    eyecolor: "",
    haircolor: "",
    specie: "",
    gender: "",
}

function onSearchEntered()
{
    var input = document.getElementById("Searchfield").value;
    document.getElementById("Searchfield").value = "";
    parseInput(input);
}   

function parseInput(text) 
{
    var words = text.toLowerCase().split(" ");
    

    // Eyes or Hair color
    if(words.length == 2)
    {
        if(words[1] == "eyes")
        {
            if(!enteredAttributes.includes("eyecolor"))
            {
                enteredAttributes.push("eyecolor");
                CharacterAttributeJSON.eyecolor = capitalize(words[0]);
                addCharacterAttributeToUI("eyecolor");
                
            }
        }   
        else if(words[1] == "hair")
        {
            if(!enteredAttributes.includes("haircolor"))
            {
                CharacterAttributeJSON.haircolor = capitalize(words[0]);
                enteredAttributes.push("haircolor");
                addCharacterAttributeToUI("haircolor");
                
            }
        }
    }
    else if (words.length == 1)
    {
        if(words[0] == "male" || words[0] == "female")
        {
            if(!enteredAttributes.includes("gender"))
            {
                
                CharacterAttributeJSON.gender = capitalize(words[0]);
                enteredAttributes.push("gender");
                addCharacterAttributeToUI("gender");
            }
        }
        else 
        {
            
            if(!enteredAttributes.includes("specie"))
            {
                CharacterAttributeJSON.specie = capitalize(words[0]);
                enteredAttributes.push("specie");
                addCharacterAttributeToUI("specie");
            }
        }
    }
    else if (words.length == 3)
    {
        if(isNumber(words[0]) && words[1] == "years" && words[2] == "old")
        {
            if(!enteredAttributes.includes("age"))
            {
                
                CharacterAttributeJSON.age = words[0];
                enteredAttributes.push("age");
                addCharacterAttributeToUI("age");
            }
        }
    }
    else
    {
        alert("Couldn't add a given attribute")
    }
    if(words.includes("boobs"))
    {
        alert("what are you doing, you dirty pervert");
    }
}

function addCharacterAttributeToUI(attribute)
{
    
    var attributeDiv = document.createElement("div");
    attributeDiv.setAttribute("class", "AttributeBox");

    var label = document.createElement("label");
    label.innerHTML = attribute;
    label.setAttribute("id", "AttributeLabel");

    var xButton = document.createElement("button");
    xButton.setAttribute("id", "AttributeButton");
    xButton.innerHTML = "X";
    xButton.addEventListener('click', function(){
        switch (attribute) {
            case "eyecolor":
                CharacterAttributeJSON.eyecolor = "";
                break;
            case "haircolor":
                CharacterAttributeJSON.haircolor = "";
                break;
            case "gender":
                CharacterAttributeJSON.gender = "";
                break;
            case "age":
                CharacterAttributeJSON.age = "";
                break;
            case "specie":
                CharacterAttributeJSON.specie = "";
                break;
        }
        ArrayRemove(enteredAttributes, attribute);
        document.getElementById("AttributeDivision").removeChild(attributeDiv);
    });
    attributeDiv.appendChild(label);
    attributeDiv.appendChild(xButton);

    
    document.getElementById("AttributeDivision").appendChild(attributeDiv);
}

async function onFindPressed() 
{
    var data = await getJSONData("people");
    
    var newData = [];
    for (let index = 0; index < data.length; index++) {
        var element = data[index];

        if((element.eye_color == CharacterAttributeJSON.eyecolor || CharacterAttributeJSON.eyecolor == "")
        && (element.hair_color == CharacterAttributeJSON.haircolor || CharacterAttributeJSON.haircolor == "")
        && (element.gender == CharacterAttributeJSON.gender || CharacterAttributeJSON.gender == "")
        && (element.age == CharacterAttributeJSON.age || CharacterAttributeJSON.age == "")
        && !(CharacterAttributeJSON.eyecolor == "" && CharacterAttributeJSON.haircolor == "" && CharacterAttributeJSON.gender == "" && CharacterAttributeJSON.age == "" && CharacterAttributeJSON.specie == ""))
        {
            if(CharacterAttributeJSON.specie == "")
            {
                
                newData.push(element);
            }
            else 
            {
                var page = element.species.split("/");
                var speciedata = await getJSONData("species/" + page[page.length - 1]);
                if(speciedata.name == CharacterAttributeJSON.specie)
                {
                    newData.push(element);
                    
                }
            }
        }    
    }
    
    CharacterArray = newData;
    if(CharacterArray.length == 0)
    {
        alert("No Characters Found");
        return;
    }
    
    let numOfBoxesForCharacters = (CharacterArray.length <= 5) ? CharacterArray.length : 5;
    var container = document.getElementById("RightPanel");
    container.innerHTML = "";
    for(let i = 0; i < numOfBoxesForCharacters; i++)
    {
        var division = document.createElement("div");
        division.setAttribute("class", "LabelDivision");

        var label = document.createElement("label");
        division.appendChild(label);
     

        division.addEventListener('click', function(event){
            let character = CharacterArray[i + CharacterIndex];
            localStorage.setItem("CharacterFilms", character.films[0]);
            document.location.href = "animepage.html";

        });
        division.addEventListener('mouseenter', function(event)
        {
            SelectedIndex = i;
            updateImage(CharacterArray[(SelectedIndex + CharacterIndex) % CharacterArray.length].name);
        });

        container.appendChild(division);
    }
    updateCharacterPanel();
    
    document.getElementById("Wrapper").style.transform = "translate(0, -100%)";
}



function updateCharacterPanel() {
    var elems = document.getElementById("RightPanel").children;
    for(let i = 0; i < elems.length; i++)
    {
        elems[i].children[0].innerHTML = CharacterArray[(i + CharacterIndex) % CharacterArray.length].name;
    }
}
function wheelTurned(event) {
    if(CharacterArray.length < 5) return;
    if(event.deltaY < 0)
    {
        CharacterIndex -= 1;
        if (CharacterIndex < 0) CharacterIndex = CharacterArray.length - 1;

    }else if (event.deltaY > 0)
    {
        CharacterIndex = (CharacterIndex +  1) % CharacterArray.length;
    }
    
    updateImage(CharacterArray[(SelectedIndex + CharacterIndex) % CharacterArray.length].name);
    updateCharacterPanel();
}




function goToAnime(character)
{
    localStorage.setItem("CharacterName", character.name);
    localStorage.setItem("CharacterAge", character.age);
    localStorage.setItem("CharacterGender", character.gender);
    localStorage.setItem("CharacterEye", character.eye_color);
    localStorage.setItem("CharacterHair", character.hair_color);
    localStorage.setItem("CharacterFilms", character.films[0]);

    document.location.href = "animepage.html";
}

function onGoToSearchPressed()
{
    // location.href = "#Wrapper";
    document.getElementById("Wrapper").style.transform = "translate(0, 0%)";
    
    CharacterIndex = 0;
}

function updateImage(name)
{
    document.getElementById("ListBackgroundImage").src = characterFolder + name + ".png";
}

function updateTime()
{
    var date = new Date();
    var h = date.getHours(); // 0 - 23
    var m = date.getMinutes(); // 0 - 59
    if (m >= 0 && m <= 9)
    {
        m = "0" + m;
    }
    var text = "";
    console.log(h);
    if(h >= 12 && h < 18)
    {
        text = "Good afternoon";
    } else if (h >= 18 && h <= 23)
    {
        text = "Good evening";
    } else if(h >= 6 && h < 12)
    {
        text = "Good morning";
    }

    var time = h + ":" + m;
    document.getElementById("WelcomeText").innerHTML = text;
    document.getElementById("ClockDivision").innerHTML = time;

    setTimeout(updateTime, 1000);
}

function updateWeather(){
    let currentLocation = navigator.geolocation;
    if (currentLocation) {
        currentLocation.getCurrentPosition(tester);
    } else { 
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function tester(position)
{
    console.log(position.coords);
    let weatherData = getWeatherJSON(position.coords.latitude, position.coords.longitude);
    weatherData.then((value) =>{
        document.getElementById("WeatherTemperature").innerHTML = value.main.temp + "°";
        document.getElementById("WeatherLocation").innerHTML = value.name;
    });

    setTimeout(updateTime, 60000);
}