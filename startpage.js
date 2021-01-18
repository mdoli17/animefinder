
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
const characterFolder = "Images/Characters/";

let eyeColors = ["Black", "Blue", "Brown", "Grey", "Green", "Hazel", "Red", "White", "Yellow", "Emerald"];
let hairColors = ["Black", "Blonde", "Brown", "Grey", "White", "Light", "Orange", "Beige"];

var characterAttributes;
var enteredAttributes = [];

function constructor()
{
    characterAttributes = new CharacterAttributes();
}

window.onload = constructor();

function CharacterAttributes()
{
    this.name = null;
    this.age = null;
    this.eyecolor = null;
    this.haircolor = null;
    this.specie = null;
    this.gender = null;
}


function onSearchEntered()
{
    var input = document.getElementById("userinput").value;
    document.getElementById("userinput").value = "";
    parseInput(input);
}   


/*
    Eye color
    Hair Color
    Age
    Gender
    Specie
*/
function parseInput(text) 
{
    var words = text.toLowerCase().split(" ");
    console.log(words);

    // Eyes or Hair color
    if(words.length == 2)
    {
        if(words[1] == "eyes")
        {
            if(!enteredAttributes.includes("eyecolor"))
            {
                enteredAttributes.push("eyecolor");
                characterAttributes.eyecolor = capitalize(words[0]);
                addCharacterAttributeToUI("eyecolor");
            }
        }   
        else if(words[1] == "hair")
        {
            if(!enteredAttributes.includes("haircolor"))
            {
                characterAttributes.haircolor = capitalize(words[0]);
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
                alert("adding gender");
                characterAttributes.gender = capitalize(words[0]);
                enteredAttributes.push("gender");
                addCharacterAttributeToUI("gender");
            }
        }
        else 
        {
            alert("Trying to add specie");
            if(!enteredAttributes.includes("specie"))
            {
                characterAttributes.specie = capitalize(words[0]);
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
                characterAttributes.age = words[0];
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
    attributeDiv.setAttribute("class", "attributeBox");

    var label = document.createElement("label");
    label.innerHTML = attribute;

    var xButton = document.createElement("button");
    xButton.setAttribute("class", "attributeBoxXButton");
    xButton.innerHTML = "x";
    xButton.addEventListener('click', function(){
        switch (attribute) {
            case "eyecolor":
                characterAttributes.eyecolor = null;
                break;
            case "haircolor":
                characterAttributes.haircolor = null;
                break;
            case "gender":
                characterAttributes.gender = null;
                break;
            case "age":
                characterAttributes.age = null;
                break;
            case "specie":
                characterAttributes.specie = null;
                break;
        }
        ArrayRemove(enteredAttributes, attribute);
        document.getElementById("characterattributes").removeChild(attributeDiv);
    });
    attributeDiv.appendChild(label);
    attributeDiv.appendChild(xButton);

    
    document.getElementById("characterattributes").appendChild(attributeDiv);
}

function onFindPressed() 
{
    var data = getJSONData("people");
    
    var newData = [];
    data.then((value) => {
        value.forEach(element => {
            if((element.eye_color == characterAttributes.eyecolor || characterAttributes.eyecolor == null)
            && (element.hair_color == characterAttributes.haircolor || characterAttributes.haircolor == null)
            && (element.gender == characterAttributes.gender || characterAttributes.gender == null)
            && (element.age == characterAttributes.age || characterAttributes.age == null)
            && !(characterAttributes.eyecolor == null && characterAttributes.haircolor == null && characterAttributes.gender == null && characterAttributes.age == null && characterAttributes.specie == null))
            {
                if(characterAttributes.specie == null)
                {
                    newData.push(element);
                }
                else {
                    
                }
            }    
        });
        updateUI(newData);
    });

}

function updateUI(dataArray)
{
    document.getElementById("container").textContent = " ";
    
    var count = dataArray.length;
    if(count == 0) 
    {
        alert("No character with these attributes were found");
        return;
    }
    for(var i = 0; i < count; i++)
    {
        var imgBox = document.createElement("div");
        imgBox.setAttribute("class", "box");

        var imgelem = new Image();
        imgelem.src = characterFolder + dataArray[i].name + ".png";
        imgelem.setAttribute("onerror", "this.src='testimage.png'");
        imgelem.setAttribute("class", "characterImages");
        
        imgBox.appendChild(imgelem);
        document.getElementById("container").appendChild(imgBox);
    }
}


async function getJSONData(str)
{
    const response = await fetch(HomeURL + str, {mode: "cors"});
    const data = await response.json();
    return data;
}
const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}
async function getNames() {
    var data = getJSONData("people");
    var newdata = [];
    data.then((safedata) => {
        const start = async () => {
            await asyncForEach(safedata, async (value) => {
                
                var page = value.species.split("/");
                getspecies("species/" + page[page.length - 1]);

            });
            console.log("Peaple Fetched");
        }
        start();
    });
    
}

async function getspecies(link)
{
    var speciedata = getJSONData(link)
    speciedata.then((safedata) => {
        const start = async() => {
            await asyncForEach(safedata, async (value) => {
                console.log(value.name);
            });
            console.log("Done");
        }
        start();
    });
}



var prevScrollpos = document.getElementById("container").scrollTop;
function printer()
{
    var currentScrollPos = document.getElementById("container").scrollTop;
    if (prevScrollpos > currentScrollPos) {
        document.getElementById("searchfield").style.top = "1%";
    } else {
        document.getElementById("searchfield").style.top = "-50px";
    }
    prevScrollpos = currentScrollPos;
}
