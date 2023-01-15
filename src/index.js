let favListCount = 0;

//difference between window and document.addEventLuistener
document.addEventListener('DOMContentLoaded', (event) => {
    
    buildFavCocktailsList();

    //access to body elements
    const form = document.querySelector("#form");
    const ul = document.querySelector("#cocktails_ul");

    form.addEventListener("submit", (e)=> {
        e.preventDefault();
        let input = e.target.querySelector("#search").value;
        let drinkArray = [];

        //setup fetch url
        const url = "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=" + input;

        
        //remove current list from UL - to refresh search results
        let count = ul.children.length;
        for(let i = count-1; i >= 0; i--){
            ul.children[i].remove();
        }

        // fetch url data - create list of cocktails - create click event to display clicked cocktail li
        fetchData(input, drinkArray, url, ul);
    });//----end form submit request
});





//------------------------------------------------------------POST new fav selection to Database
function addFavCocktailToDB(name_dat, imgURL_dat){
    
    //update favorite cocktail header count
    favListCount++;
    let favCount_p = document.querySelector("#favCocktailsCount");
    favCount_p.textContent = favListCount;

    //create object to POST
    const favCocktail = {
        id: 0,
        name: name_dat,
        imageUrl: imgURL_dat,
        rating: 0
    }

    //POST that created object
    fetch("http://localhost:3000/cocktailsDAT", {
        method: 'POST',
        headers: {
            'content-Type': 'application/json',
        },
        body: JSON.stringify(favCocktail)
    })
}

function fetchData(input, drinkArray, url, ul){
    fetch(url)
        .then((response) => response.json())
        .then((data) => drinkArray = data.drinks)
        .then( ()=> {
            for(drink of drinkArray){
                //create li
                let li = document.createElement("li");
                li.append( document.createElement("p").textContent = drink.strDrink );
                li.id = "drink_listed";

                //-----------------------------------------create cocktail display items
                let div_main = document.querySelector("#cocktail_info_div_main");
                let div = document.createElement("div");
                div.id = "cocktail_info_div";
                //setup cocktail image
                let img = document.createElement("img");
                img.src = drink.strDrinkThumb;
                img.alt = "missing_img";
                img.id = "cocktail_info_img";
                //setup text
                let cocktailName = document.createElement("h3")
                cocktailName.textContent = drink.strDrink;
                let glassTypeUsed = document.createElement("p");
                glassTypeUsed.textContent = `Glass type used: ${drink.strGlass}`;
                let instrusctionsText = document.createElement("p")
                instrusctionsText.textContent = `Instructions: ${drink.strInstructions}`;
                instrusctionsText.id = "cocktail_instructions_p";
                let fav_button = document.createElement('button');
                fav_button.textContent = "Like!";
                

                //click event for Like button to add new cocktail to fav list
                addLikeButtonToDisplay(fav_button, cocktailName, img);

                //add click event to each li - click adds cocktail to a preview section
                li.addEventListener("click", (e)=>{
                    e.preventDefault();

                    //delete previous cocktail info display div if it exists
                    let div_delete = document.querySelector("#cocktail_info_div");
                    if(div_delete){
                        div_delete.remove();
                    }
                    //append items to div that displays the cocktail info
                    div.append(img, cocktailName, glassTypeUsed, instrusctionsText, fav_button);
                    div_main.append(div);
                });//---end li click event
                ul.append(li);
            }//----end for loop to create li cocktails
        })//----- end fetch request
}

//----------------------------------------------------------Build fav list from database - build at webpage load (called once)
function buildFavCocktailsList(){
    //GET request
    fetch("http://localhost:3000/cocktailsDAT")
    .then( (resp) => resp.json())
    .then( (data) => {
        for(cocktail in data){           
            let table = document.querySelector("#fav_table");
                    let newRow = document.createElement("tr");
                    let col_1 = document.createElement("td");

                    //setup coloumn 01
                    let favCocktailName_p = document.createElement('p');
                    favCocktailName_p.textContent = data[cocktail].name;
                    let favCocktail_img = document.createElement("img");
                    favCocktail_img.src = data[cocktail].imageUrl;
                    favCocktail_img.id = "fav_img_ph";
                    col_1.append(favCocktailName_p, favCocktail_img);

                    newRow.append(col_1);
                    table.append(newRow);
        }
        //add number of liked cocktails to the header
        updateFavListHeaderCount(data);
    })
}

function updateFavListHeaderCount(data){
    //add number of liked cocktails to the header
    let favCount_p = document.querySelector("#favCocktailsCount");
    data.forEach(element => ++favListCount);
    favCount_p.textContent = favListCount;
}

function addLikeButtonToDisplay(fav_button, cocktailName, img){
    fav_button.addEventListener("click", (e)=>{
        e.preventDefault();

        let table = document.querySelector("#fav_table");
        let newRow = document.createElement("tr");
        let col_1 = document.createElement("td");

        //setup coloumn 01
        let favCocktailName_p = document.createElement('p');
        favCocktailName_p.textContent = cocktailName.textContent;
        let favCocktail_img = document.createElement("img");
        favCocktail_img.src = img.src;
        favCocktail_img.id = "fav_img_ph";
        col_1.append(favCocktailName_p, favCocktail_img);

        //------------------------------------------add new cocktail to DB
        addFavCocktailToDB(cocktailName.textContent, img.src);
        

        newRow.append(col_1);
        table.append(newRow);
    })
}