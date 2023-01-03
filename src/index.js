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

        fetch(url)
        .then((response) => response.json())
        .then((data) => drinkArray = data.drinks)
        .then( ()=> {
            for(drink of drinkArray){
                //create li
                let li = document.createElement("li");
                li.append( document.createElement("p").textContent = drink.strDrink );
                li.id = "drink_listed";

                
                //add click event to each li
                li.addEventListener("click", (e)=>{
                    e.preventDefault();
                    console.log(li.textContent);
                });


                //append li to UL
                ul.append(li);
                console.log(drink.strDrink);
            }
        });
    })
});