let favListCount = 0;

document.addEventListener('DOMContentLoaded', (event) => {
    
    buildFavCocktailsList();

    const form = document.querySelector("#form");
    const ul = document.querySelector("#cocktails_ul");

    form.addEventListener("submit", (e)=> {
        e.preventDefault();
        let input = e.target.querySelector("#search").value;
        let drinkArray = [];

        const url = "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=" + input;

        
        let count = ul.children.length;
        for(let i = count-1; i >= 0; i--){
            ul.children[i].remove();
        }

        fetchData(input, drinkArray, url, ul);
    });
});



function addFavCocktailToDB(name_dat, imgURL_dat){
    
    favListCount++;
    let favCount_p = document.querySelector("#favCocktailsCount");
    favCount_p.textContent = favListCount;

    const favCocktail = {
        id: 0,
        name: name_dat,
        imageUrl: imgURL_dat,
        rating: 0
    }

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
                let li = document.createElement("li");
                li.append( document.createElement("p").textContent = drink.strDrink );
                li.id = "drink_listed";

                let div_main = document.querySelector("#cocktail_info_div_main");
                let div = document.createElement("div");
                div.id = "cocktail_info_div";
                
                let img = document.createElement("img");
                img.src = drink.strDrinkThumb;
                img.alt = "missing_img";
                img.id = "cocktail_info_img";
                
                let cocktailName = document.createElement("h3")
                cocktailName.textContent = drink.strDrink;
                let glassTypeUsed = document.createElement("p");
                glassTypeUsed.textContent = `Glass type used: ${drink.strGlass}`;
                let instrusctionsText = document.createElement("p")
                instrusctionsText.textContent = `Instructions: ${drink.strInstructions}`;
                instrusctionsText.id = "cocktail_instructions_p";
                let fav_button = document.createElement('button');
                fav_button.textContent = "Like!";
                
                
                addLikeButtonToDisplay(fav_button, cocktailName, img);

                li.addEventListener("click", (e)=>{
                    e.preventDefault();

                    let div_delete = document.querySelector("#cocktail_info_div");
                    if(div_delete){
                        div_delete.remove();
                    }

                    div.append(img, cocktailName, glassTypeUsed, instrusctionsText, fav_button);
                    div_main.append(div);
                });
                ul.append(li);
            }
        })
}


function buildFavCocktailsList(){

    fetch("http://localhost:3000/cocktailsDAT")
    .then( (resp) => resp.json())
    .then( (data) => {
        console.log(data);
        data.forEach(element => {
            console.log("some");
            buildList(element); 
        });
        updateFavListHeaderCount(data);
    } )
}


//--------------------------------------------------------------------
function buildList(data){
    let table = document.querySelector("#fav_table");
        let favCocktailName_p = document.createElement('p');
        favCocktailName_p.textContent = data.name;
        let favCocktail_img = document.createElement("img");
        favCocktail_img.src = data.imageUrl;
        favCocktail_img.id = "fav_img_ph";

        let rating = document.createElement('p');
        rating.textContent = "rating: " + data.rating;

        updateFavList(favCocktailName_p.textContent, favCocktail_img, rating.textContent);
}


function updateFavListHeaderCount(data){
    let favCount_p = document.querySelector("#favCocktailsCount");
    data.forEach(element => ++favListCount);
    favCount_p.textContent = favListCount;
}

function addLikeButtonToDisplay(fav_button, cocktailName, img){
    fav_button.addEventListener("click", (e)=>{
        e.preventDefault();

        let favCocktailName_p = document.createElement('p');
        favCocktailName_p.textContent = cocktailName.textContent;
        let favCocktail_img = document.createElement("img");
        favCocktail_img.src = img.src;
        favCocktail_img.id = "fav_img_ph";
        let ratingDefualt_p = document.createElement("p");
        ratingDefualt_p.textContent =  "rating: " + 0;
        
        updateFavList(favCocktailName_p.textContent, favCocktail_img, ratingDefualt_p.textContent);

        addFavCocktailToDB(cocktailName.textContent, img.src);
    })
}


function updateFavList(name, img, rating){
        let table = document.querySelector("#fav_table");
        let newRow = document.createElement("tr");
        let col_1 = document.createElement("td");

    
        col_1.append(name, img, rating);
        newRow.append(col_1);
        table.append(newRow);
}