

window.addEventListener('DOMContentLoaded', (event) => {
    
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

        console.log("children count before loop: " + ul.children.length);
        let count = ul.children.length;
        //remove current list from UL
        for(let i = count-1; i >= 0; i--){
            console.log(i);
            console.log("remove element: " + ul.children)
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
                let fav_button = document.createElement('bottom');
                
                //add click event to each li - click adds cocktail to a preview section
                li.addEventListener("click", (e)=>{
                    e.preventDefault();
                    console.log(li.textContent);

                    //delete previous cocktail info display div if it exists
                    let div_delete = document.querySelector("#cocktail_info_div");
                    if(div_delete){
                        div_delete.remove();
                    }
      
                    //append items to div
                    div.append(img, cocktailName, glassTypeUsed, instrusctionsText);
                    div_main.append(div);
                });//---end liclick event
                //append li to UL
                ul.append(li);
            }//----end for loop to create li cocktails
        })//----- end fetch request
    });//----end form submit request
});