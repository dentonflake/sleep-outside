import { getLocalStorage } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

export default class CheckoutProcess {

  constructor(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.list = [];
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;

    this.services = null;

  }
  packageItems(items) {

    return items.map(item => {
      return {
        id: item.Id,
        name: item.Name,
        price: item.FinalPrice,
        quantity: item.quantity || 1
      };
    });
  }

  init() {
    this.list = getLocalStorage(this.key) || [];
    this.calculateItemSubTotal();
    this.calculateOrderTotal();
    this.displayOrderTotals();
    // this.display();
  }

  calculateItemSubTotal() {
    const cartItems = getLocalStorage(this.key) || [];
    console.log("Carrito cargado:", cartItems);
    let total = 0;

    // Recorrer los productos y calcular el subtotal
    for (let i = 0; i < cartItems.length; i++) {
      const item = cartItems[i];
      total += item.FinalPrice * (item.quantity || 1);
    }


    // Guardar el subtotal en la propiedad de la clase
    this.itemTotal = total;

    // Mostrarlo en el checkout 

    const totalEl = document.querySelector("#subtotal");
    if (totalEl) {
      totalEl.textContent = `$${this.itemTotal.toFixed(2)}`;
    }
  }

  // calculate the tax and shipping amounts. Add those to the cart total to figure out the order total
  calculateOrderTotal() {
    this.tax = (this.itemTotal * 0.06);
    this.shipping = 10;
    this.orderTotal = this.itemTotal + this.tax + this.shipping;

    console.log("total", this.orderTotal);
  }

  //display the totals.
  displayOrderTotals() {

    const tax = document.querySelector("#tax");
    tax.textContent = `$${this.tax.toFixed(2)}`;

    const shipping = document.querySelector("#shipping");
    shipping.textContent = `$${this.shipping.toFixed(2)}`;

    const total = document.querySelector("#total");
    total.textContent = `$${this.orderTotal.toFixed(2)}`;

  }


  async checkout(form) {
    // 1. Obtener los datos del formulario
    const formData = new FormData(form);

    // 2. Convertir el FormData a un objeto normal
    const orderData = Object.fromEntries(formData.entries());

    // 3. Agregar info adicional que no está en el form
    orderData.orderDate = new Date().toISOString();
    orderData.orderTotal = this.orderTotal.toFixed(2);
    orderData.tax = this.tax.toFixed(2);
    orderData.shipping = this.shipping;
    orderData.items = this.packageItems(this.list);

    // 4. Mostrar en consola para verificar
    console.log("Objeto del pedido listo:", orderData);
    try {
      const result = await this.services.checkout(orderData);
      console.log("Server Answer:", result);
      //alert("Order sent successfully");

      localStorage.removeItem(this.key);
      this.list = [];
      //this.renderOrderSummary();
      window.location.href = "./cart/success.html"

    } catch (err) {
      console.error("Error enviado por el servidor:", err);
      alert("There was a problem sending your order");

    }


    //   
  }

}
