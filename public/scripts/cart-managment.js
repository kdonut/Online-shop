const addToCartButtoElem = document.querySelector("#product-details button");
const cartBadgeElem = document.querySelector(".nav-items .badge");

async function addToCart() {
  const productId = addToCartButtoElem.dataset.productid;
  const csrfToken = addToCartButtoElem.dataset.csrf;
  const data = { productId: productId, _csrf: csrfToken };

  let response;
  //try {
    response = await fetch("/cart/items/" + productId + "?_csrf=" + csrfToken, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        //'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
//   } catch (error) {
//     alert("Something went wrong!");
//     return;
//   }

  if (!response.ok) {
    alert("Something went wrong!");
    return;
  }

  //  response = await fetch('/cart/items',{
  //     method: 'POST',
  //     body : JSON.stringify({
  //         productId: productId,
  //         _csrf: csrfToken }),
  //     headers: {
  //         'Content-Type': 'application/json'

  //       },

  // });

  const responseData = await response.json();
  console.log("Response : " + responseData.newTotalItems);
  const newTotalQuantity = responseData.newTotalItems;

  cartBadgeElem.textContent = newTotalQuantity;
}

addToCartButtoElem.addEventListener("click", addToCart);
