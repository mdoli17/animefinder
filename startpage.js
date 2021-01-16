
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


function include(file) { 
  
  var script  = document.createElement('script'); 
  script.src  = file; 
  script.type = 'text/javascript'; 
  script.defer = true; 
  
  document.getElementsByTagName('head').item(0).appendChild(script); 
} 

const HomeURL = "https://ghibliapi.herokuapp.com/people";
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

/*
    Called when user enters something in search field
    Should get the input and call a parser for it
    Clear the search field
*/
function onSearchEntered()
{
    var input = document.getElementById("userinput").value;
    document.getElementById("userinput").value = "";
    parseInput(input);
}   

/*
    Should parse the given text
    Text can be given in any format
    
    Successful parsing cases:
        The last word is a Character attribute and the words before are adjactives
        Number + "Years old"
        Specie type e.g: "God", "Human", "Cat" ... 
        Gender
        Name
    
    Fill in CharacterAttributes struct with given parsed input
*/
function parseInput(text) 
{
    var words = text.toLowerCase().split(" ");
    
    console.log(words);
    var last = words[words.length - 1];
    
    if(last == "eyes")
    {
        if(!enteredAttributes.includes("eyecolor"))
        {
            var eyecolor;
            for(var i = 0; i < words.length - 1; i++)
            {
                var color = capitalize(words[i]);
                if (eyeColors.includes(color))
                {
                    eyecolor = color;
                    break;
                }
            }
            enteredAttributes.push("eyecolor");
            characterAttributes.eyecolor = eyecolor;
            addCharacterAttributeToUI("Eye Color");
            console.log("The user is trying to add an EYE attribute");
        }
        else 
        {
            console.log("The user is trying to add a EYE attribute, which is already added");
            console.log("EYE attribute should be updated");
        }
    }
    else if(last == "hair")
    {
        if(!enteredAttributes.includes("haircolor"))
        {
            var haircolor = capitalize(words[0]);
            characterAttributes.haircolor = haircolor;
            enteredAttributes.push("haircolor");
            addCharacterAttributeToUI("haircolor");
            console.log("The user is trying to add an HAIR attribute");
        } 
        else 
        {

            alert("The user is trying to add a HAIR attribute, which is already added\nHAIR attribute should be updated")
        }
    }      
    else if(words[0] == "male" || words[0] == "female"){
        characterAttributes.gender = capitalize(words[0]);
        addCharacterAttributeToUI("gender");
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
            case "Eye Color":
                characterAttributes.eyecolor = null;
                ArrayRemove(enteredAttributes, "eyecolor");
                break;
        
            case "haircolor":
                characterAttributes.haircolor = null;
                ArrayRemove(enteredAttributes, "haircolor");
                break;
            case "gender":
                characterAttributes.gender = null;
                break;
        }
        document.getElementById("characterattributes").removeChild(attributeDiv);
    });
    attributeDiv.appendChild(label);
    attributeDiv.appendChild(xButton);

    
    document.getElementById("characterattributes").appendChild(attributeDiv);
}

/*
    Gets JSON data according to the CharacterAttributes
*/
function onFindPressed() 
{
    var data = getJSONData();
    var newData = [];
    data.then((value) => {
        value.forEach(element => {
            if((element.eye_color == characterAttributes.eyecolor || characterAttributes.eyecolor == null)
            && (element.hair_color == characterAttributes.haircolor || characterAttributes.haircolor == null)
            && !(characterAttributes.eyecolor == null && characterAttributes.haircolor == null))
            {
                newData.push(element);
            }    
        });
        updateUI(newData);
    });

}


// Updates the Scrollable Div with Data
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


async function getJSONData()
{
    const response = await fetch(HomeURL, {mode: "cors"});
    const data = await response.json();
    return data;
}

function getNames() {
    var data = getJSONData();
    data.then((element) => {
        element.forEach(value => {
            console.log(value.name);
        });
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
