//manage items already added to the cart
const cartItemUpdateFormElements = document.querySelectorAll(
  "#cart-item-managment"
);

const cartTotalPriceElem = document.getElementById("cart-total-price");
const cartBadgeElements = document.querySelectorAll(".nav-items .badge");

async function updateCartItem(event) {
  event.preventDefault();
  const form = event.target;

  const productId = form.dataset.productid;
  const csrfToken = form.dataset.csrf;
  const quantity = form.firstElementChild.value;

  let response;
  //try{

  response = await fetch(
    "/cart/items/update/" + productId + "/" + quantity + "?_csrf=" + csrfToken,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        //'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  //  response = await fetch('/cart/items',{
  //     method: 'PATCH',
  //     body: JSON.stringify({
  //         productId:productId,
  //         quantity:quantity,
  //         _csrf : csrfToken
  //     }),
  //     headers : {
  //         'Content-Type' : 'application/json'
  //     }
  // });

  // }catch(error){
  //     alert('Cos nie pyklo');
  //     return;
  // }

  // if(!response.ok){
  //     alert('Cos nie pyklo z response');
  //     return;
  // }



  const data = await response.json();
  responseData = data.updatedCartData;

  if (responseData.updatedItemPrice === 0) {
    form.parentElement.parentElement.remove();
  } else {
    const cartItemTotalPriceElem =
      form.parentElement.querySelector(".cart-item-price");
    cartItemTotalPriceElem.textContent = responseData.updatedItemPrice;
  }

  cartTotalPriceElem.textContent = responseData.newTotalPrice.toFixed(2);
  for(const cartBadgeElement of cartBadgeElements){

      cartBadgeElement.textContent = responseData.newTotalQuantity;
  }

}

for (const formElement of cartItemUpdateFormElements) {
  formElement.addEventListener("submit", updateCartItem);
}
