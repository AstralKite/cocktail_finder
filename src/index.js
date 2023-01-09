


window.addEventListener('DOMContentLoaded', (event) => {
    
    buildFavCocktailsList();

    //access to body elements
    const form = document.querySelector("#form");
    const ul = document.querySelector("#cocktails_ul");

    form.addEventListener("submit", (e)=> {
        e.preventDefault();
        let input = e.target.querySelector("#search").value;
        let drinkArray = [];

        //get data
        //switch case to find which url link to use based on the radio buttons (eventually)
        const url = "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=" + input;

        let count = ul.children.length;
        //remove current list from UL
        for(let i = count-1; i >= 0; i--){
            ul.children[i].remove();
        }

        // fetch url data - create list of cocktails - create click event to display clicked cocktail li
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
                

                //click event for lick button to add new fav cocktail
                fav_button.addEventListener("click", (e)=>{
                    e.preventDefault();

                    let table = document.querySelector("#fav_table");
                    let newRow = document.createElement("tr");
                    let col_1 = document.createElement("td");
                    let col_3 = document.createElement("td");

                    //setup coloumn 01
                    let favCocktailName_p = document.createElement('p');
                    favCocktailName_p.textContent = cocktailName.textContent;
                    let favCocktail_img = document.createElement("img");
                    favCocktail_img.src = img.src;
                    favCocktail_img.id = "fav_img_ph";
                    col_1.append(favCocktailName_p, favCocktail_img);

                    //setup column 02
                    // ratingColoumn() -> called in the newRow.append()

                    //setup coulmn 03
                    let delete_btn = document.createElement('button');
                    delete_btn.textContent = "X";
                    col_3.append(delete_btn);

                    //------------------------------------------add new cocktail to DB
                    addFavCocktailToDB(cocktailName.textContent, img.src)

                    newRow.append(col_1, ratingColoumn(), col_3);
                    table.append(newRow);
                    //cocktail name => cocktailName.textContent
                    //cocktail image => img.src
                })

                //add click event to each li - click adds cocktail to a preview section
                li.addEventListener("click", (e)=>{
                    e.preventDefault();

                    //delete previous cocktail info display div if it exists
                    let div_delete = document.querySelector("#cocktail_info_div");
                    if(div_delete){
                        div_delete.remove();
                    }
      
                    //append items to div
                    div.append(img, cocktailName, glassTypeUsed, instrusctionsText, fav_button);
                    div_main.append(div);
                });//---end liclick event
                //append li to UL
                ul.append(li);
            }//----end for loop to create li cocktails
        })//----- end fetch request
    });//----end form submit request
});



function ratingColoumn(){
    let td = document.createElement('td');
    let select = document.createElement('select');

    select.name = "rating";
    select.id = "cocktail_rating_id";
        let option0 = document.createElement('option');
        option0.value = "";
        option0.textContent = "-- unrated --";
        let option1 = document.createElement('option');
        option1.value = "average";
        option1.textContent = "average";
        let option2 = document.createElement('option');
        option2.value = "tasty";
        option2.textContent = "tasty";
        let option3 = document.createElement('option');
        option3.value = "excellent";
        option3.textContent = "excellent";

        option3.selected = "selected";
    
    //                          <td>
    //                             <select name="rating" id="cocktail_rating_id">
    //                             <option value="average">average</option>
    //                             <option value="tasty">tasty</option>
    //                             <option value="excellent">excellent</option>
    //                             </select>
    //                         </td>

    select.append(option0, option1, option2, option3);
    td.append(select);
    return td;
}


function ratingColoumnFromDB(data){
    let td = document.createElement('td');
    let select = document.createElement('select');


    //select may need an onChange() function to handle option changes

    select.name = data.id;
    select.id = "cocktail_rating_id";
        let option0 = document.createElement('option');
        option0.value = 0;
        option0.textContent = "-- unrated --";
        let option1 = document.createElement('option');
        option1.value = 1;
        option1.textContent = "average";
        let option2 = document.createElement('option');
        option2.value = 2;
        option2.textContent = "tasty";
        let option3 = document.createElement('option');
        option3.value = 3;
        option3.textContent = "excellent";

        let optionArray = [option0, option1, option2, option3];
        //console.log(optionArray.find( (element) => element.value == data.rating));
        optionArray.find( (element) => element.value == data.rating).selected = "selected";
        

        //--------------------------------------------------  on change event for current dropdown select
        select.addEventListener("change", (e)=>{
            // console.log(e.target.value)
            // console.log(e.target)

            //GET request of the current DB - Add to JS object - Find match of Select.name && Data.id -- on match go inside id's parent object and update the rating
            
            let selectPosition = parseInt(select.name);

            //create placeholder object of DB
            let tempDB = [];
            
            fetch("http://localhost:3000/cocktailsDAT")
            .then( (resp) => resp.json())
            .then( (data) => {
                console.log(data);
                for(cocktail in data){    
                   if(selectPosition == data[cocktail].id){
                    console.log(data[cocktail].name);
                    data[cocktail].rating = selectPosition;
                    console.log(data);
                   }
                }
            })

            //---------------------------------  make POST to update DB rating
        });
    
    select.append(option0, option1, option2, option3);
    td.append(select);
    return td;
}

//------------------------------------------------------------POST new fav selection to Database
function addFavCocktailToDB(name_dat, imgURL_dat){

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



//----------------------------------------------------------Build fav list from database - build at webpage load (called once)
function buildFavCocktailsList(){
    //GET request
    fetch("http://localhost:3000/cocktailsDAT")
    .then( (resp) => resp.json())
    .then( (data) => {
        for(cocktail in data){           
            //name = data[cocktail].name;
            //imageUrl = data[cocktail].imageUrl;
            //rating = data[cocktail].rating;

            let table = document.querySelector("#fav_table");
                    let newRow = document.createElement("tr");
                    let col_1 = document.createElement("td");
                    let col_3 = document.createElement("td");

                    //setup coloumn 01
                    let favCocktailName_p = document.createElement('p');
                    favCocktailName_p.textContent = data[cocktail].name;
                    let favCocktail_img = document.createElement("img");
                    favCocktail_img.src = data[cocktail].imageUrl;
                    favCocktail_img.id = "fav_img_ph";
                    col_1.append(favCocktailName_p, favCocktail_img);

                    //setup column 02
                    // ratingColoumn() -> called in the newRow.append()

                    //setup coulmn 03
                    let delete_btn = document.createElement('button');
                    delete_btn.textContent = "X";
                    col_3.append(delete_btn);

                    newRow.append(col_1, ratingColoumnFromDB(data[cocktail]), col_3);
                    table.append(newRow);
                    //cocktail name => cocktailName.textContent
                    //cocktail image => img.src
        }
    })
}