import { loadHeaderFooter } from "./utils.mjs";
import CheckoutProcess from "./checkoutProcess.mjs";

loadHeaderFooter();

const checkout = new CheckoutProcess("so-cart", "#subtotal");
checkout.init();

document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();
  checkout.checkout(e.target);
});