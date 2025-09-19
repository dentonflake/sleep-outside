import { getLocalStorage, updateCartCount, loadHeaderFooter } from "./utils.mjs";

// This function adds a new product to the cart.
// It checks if the product is already there.
function addToCart(newItem) {
  var cart = getLocalStorage("so-cart") || [];
  var existingItem = null;
  
  // Look for the product in the cart by its Id.
  for (var i = 0; i < cart.length; i++) {
    if (cart[i].Id === newItem.Id) {
      existingItem = cart[i];
      break;
    }
  }

  // If the product is found, increase its quantity.
  if (existingItem) {
    existingItem.quantity = (existingItem.quantity || 1) + 1;
  } else {
    // If not found, add it to the cart with a quantity of 1.
    newItem.quantity = 1;
    cart.push(newItem);
  }

  localStorage.setItem("so-cart", JSON.stringify(cart));
  updateCartCount();
  renderCartContents();
}


window.addToCart = addToCart;

// This function draws the cart on the page.
// It makes sure there are no duplicate products.
function renderCartContents() {
  var cartItems = getLocalStorage("so-cart") || [];
  var consolidatedCart = [];
  
  // Go through all items in the cart to group them.
  for (var i = 0; i < cartItems.length; i++) {
    var currentItem = cartItems[i];
    var existingItem = null;
    
    // Check if the item is already in our new list.
    for (var j = 0; j < consolidatedCart.length; j++) {
      if (consolidatedCart[j].Id === currentItem.Id) {
        existingItem = consolidatedCart[j];
        break;
      }
    }

    // If it is, add the quantity.
    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 1) + (currentItem.quantity || 1);
    } else {
      // If it's not, create a new item and add it to our list.
      var newItem = {};
      for (var key in currentItem) {
        newItem[key] = currentItem[key];
      }
      newItem.quantity = currentItem.quantity || 1;
      consolidatedCart.push(newItem);
    }
  }

  // If the cart is empty, show a message.
  if (consolidatedCart.length === 0) {
    document.querySelector(".product-list").innerHTML = "<p>Your cart is empty.</p>";
    document.querySelector(".cart-footer").classList.add("hide");
    document.querySelector(".cart-total").textContent = "";
    return;
  }

  // Create the HTML for each item.
  var htmlItems = consolidatedCart.map(cartItemTemplate);
  document.querySelector(".product-list").innerHTML = htmlItems.join("");

  // Show the cart's total section.
  var footer = document.querySelector(".cart-footer");
  footer.classList.remove("hide");

  // Calculate the total price.
  var total = 0;
  for (var k = 0; k < consolidatedCart.length; k++) {
    var item = consolidatedCart[k];
    total = total + (item.FinalPrice * (item.quantity || 1));
  }
  document.querySelector(".cart-total").textContent = "Total: $" + total.toFixed(2);

  attachRemoveListeners();
}

function cartItemTemplate(item) {
  return "<li class=\"cart-card divider\">" +
    "<a href=\"#\" class=\"cart-card__image\">" +
    "<img src=\"" + item.Image + "\" alt=\"" + item.Name + "\" />" +
    "</a>" +
    "<a href=\"#\">" +
    "<h2 class=\"card__name\">" + item.Name + "</h2>" +
    "</a>" +
    "<p class=\"cart-card__color\">" + item.Colors[0].ColorName + "</p>" +
    "<p class=\"cart-card__quantity\">qty: " + (item.quantity || 1) + "</p>" +
    "<p class=\"cart-card__price\">$" + (item.FinalPrice * (item.quantity || 1)).toFixed(2) + "</p>" +
    "<span class=\"remove-item-btn\" data-id=\"" + item.Id + "\">X</span>" +
    "</li>";
}

// This function adds a click event to the "X" buttons.
function attachRemoveListeners() {
  var buttons = document.querySelectorAll(".remove-item-btn");
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", handleRemoveItem);
  }
}

// This function removes an item from the cart.
function handleRemoveItem(event) {
  var idToRemove = event.target.dataset.id;
  var cart = getLocalStorage("so-cart") || [];
  var newCart = [];
  
  // Create a new list without the item we want to remove.
  for (var i = 0; i < cart.length; i++) {
    if (cart[i].Id !== idToRemove) {
      newCart.push(cart[i]);
    }
  }

  localStorage.setItem("so-cart", JSON.stringify(newCart));

  renderCartContents();
  updateCartCount();
}

renderCartContents();
updateCartCount();
loadHeaderFooter();