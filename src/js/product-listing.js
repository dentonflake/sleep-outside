import { loadHeaderFooter, getParam } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";
import ProductList from "./ProductList.mjs";

loadHeaderFooter();

const category = getParam("category");
document.querySelector(".title").innerHTML = category.charAt(0).toUpperCase() + category.slice(1);

const dataSource = new ExternalServices();
const element = document.querySelector(".product-list");
const listing = new ProductList(category, dataSource, element);

listing.init();

const sortElement = document.querySelector("#sort");
sortElement.addEventListener("change", (event) =>{
    const value = event.target.value;
    let sortedList = [...listing.list];

    if (value === "name") {
        sortedList.sort((a, b) => a.Name.localeCompare (b.Name));
    } else if(value === "price"){
        sortedList.sort((a, b) => a.FinalPrice - b.FinalPrice);
    }
    
    listing.renderList(sortedList);
});