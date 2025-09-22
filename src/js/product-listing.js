import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { loadHeaderFooter, getParam } from "./utils.mjs";

const category = getParam("category");
console.log("Categoría en la URL:", category);
const dataSource = new ProductData();

const element = document.querySelector(".product-list");

const productList = new ProductList(category, dataSource, element);

const title = document.getElementById("title");
title.textContent = `Top Products: ${category}`;



productList.init();


loadHeaderFooter()