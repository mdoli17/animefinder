
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

async function onFindPressed() 
{
    var data = await getJSONData("people");
    var newData = [];

    for (let index = 0; index < data.length; index++) {
        var element = data[index];
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
            else 
            {
                var page = element.species.split("/");
                var speciedata = await getJSONData("species/" + page[page.length - 1]);
                if(speciedata.name == characterAttributes.specie)
                {
                    newData.push(element);
                }
            }
        }    
    }
    updateUI(newData);
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

        var detaildiv = document.createElement("div");
        detaildiv.setAttribute("class", "characterdetails");
        var namelabel = document.createElement("label");
        namelabel.innerHTML = "Name: " + dataArray[i].name;

        var genderlabel = document.createElement("label");
        genderlabel.innerHTML = "Gender: " + dataArray[i].gender;

        var agelabel = document.createElement("label");
        agelabel.innerHTML = "Age: " + dataArray[i].age;

        var eyelabel = document.createElement("label");
        eyelabel.innerHTML = "Eye Color: " + dataArray[i].eye_color;

        var hairlabel = document.createElement("label");
        hairlabel.innerHTML = "Eye Color: " + dataArray[i].hair_color;

        detaildiv.appendChild(namelabel);
        detaildiv.appendChild(genderlabel);
        detaildiv.appendChild(agelabel);
        detaildiv.appendChild(eyelabel);
        detaildiv.appendChild(hairlabel);
        
        var imgelem = new Image();
        imgelem.src = characterFolder + dataArray[i].name + ".png";
        imgelem.setAttribute("onerror", "this.src='testimage.png'");
        imgelem.setAttribute("class", "characterImages");
        
        imgBox.appendChild(imgelem);
        imgBox.appendChild(detaildiv);
        document.getElementById("container").appendChild(imgBox);
    }
}


async function getJSONData(str)
{
    const response = await fetch(HomeURL + str, {mode: "cors"});
    const data = await response.json();
    return data;
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
