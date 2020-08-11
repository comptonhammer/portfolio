if(document.readyState == 'loading') document.addEventListener('DOMContentLoaded', listen);
else listen();

function listen(){
    let removeCartItemButtons = document.getElementsByClassName('btn-remove');
    for(let i = 0; i < removeCartItemButtons.length; i++) removeCartItemButtons[i].addEventListener('click', removeCartItem)

    let quantityInputs = document.getElementsByClassName('cart-quantity-input');
    for(let i = 0; i < quantityInputs.length; i++) quantityInputs[i].addEventListener('change', quantityChanged);

    let addToCartButtons = document.getElementsByClassName('product-add-to-cart')
    for (let i = 0; i < addToCartButtons.length; i++) addToCartButtons[i].addEventListener('click', addToCartClicked)

    document.getElementsByClassName('btn-purchase')[0].addEventListener('click', purchaseClicked);
}

let stripeHandler = StripeCheckout.configure({
    key: pubKey,
    locale: 'auto',
    image: 'https://REDACTED.png',
    token: function(token) {
        let items = [];
        let cartContainer = document.getElementsByClassName('cart-items')[0];
        let cartRows = cartContainer.getElementsByClassName('cart-row');
        for(let i = 0; i < cartRows.length; i++){
            let row = cartRows[i];
            let quantity = row.getElementsByClassName('cart-quantity-input')[0].value;
            let rating = row.dataset.itemId;
            items.push({
                rating,
                quantity
            })
        }
        fetch('/purchase-lead', {
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
                'Accept':'application/json'
            },
            body: JSON.stringify({stripeTokenId: token.id, items: items})
        })
            .then((res)=> {
                let data = res.json();
                alert(data.message);
                let cartItems = document.getElementsByClassName('cart-items')[0];
                while(cartItems.hasChildNodes()) cartItems.removeChild(cartItems.firstChild);
                updateTotal();
            })
            .catch((err)=>console.error(err));
    }
})

function purchaseClicked(){
    let priceElement = document.getElementsByClassName('cart-total-price')[0];
    let price = parseFloat(priceElement.innerText.replace('$','')) * 100;
    stripeHandler.open({
        name:'REDACTED Services',
        description:'Lead Purchase',
        amount: price
    })
}

function removeCartItem(e){
    let buttonClicked = e.target;
    buttonClicked.parentElement.parentElement.parentElement.remove();
    updateCartTotal();
}

function addToCartClicked(e){
    let button = e.target;
    let shopItem = button.parentElement.parentElement;
    let title = shopItem.getElementsByClassName('product-name')[0].innerText;
    let price = shopItem.getElementsByClassName('product-price')[0].innerText;
    let img = shopItem.getElementsByClassName('product-img')[0].src;
    let rating = shopItem.id;
    addItemToCart({title, price, img, rating});
    updateCartTotal();
}

function addItemToCart(item){
    let cartRow = document.createElement('div');
    cartRow.classList.add('cart-row');
    cartRow.dataset.itemId = item.rating;
    let cartItems = document.getElementsByClassName('cart-items')[0];
    let cartItemNames = cartItems.getElementsByClassName('cart-item-title');
    for(let i = 0; i < cartItemNames.length; i++){
        if(cartItemNames[i].innerText == item.title){
            cartItemQuantities = cartItems.getElementsByClassName('cart-quantity-input');
            cartItemQuantities[i].value++;
            return;
        }
    }
    let newRowHTML = `
        <div class="row">
            <div class="col-sm cart-item cart-column">
                <h5><span class="cart-item-title">${item.title}</span></h5>
            </div>
            <span class="col-sm cart-price cart-column">${item.price}</span>
            <div class="input-group col-sm cart-quantity cart-column">
                <input class="form-control cart-quantity-input" type="number" value="1">
                <div class="input-group-append">
                    <button style="padding-left: 10px; padding-right: 10px;" class="close btn btn-outline-secondary btn-remove" type="button">&times;</button>
                </div>
            </div>
        </div>
        `
    cartRow.innerHTML = newRowHTML;
    cartItems.append(cartRow);
    cartRow.getElementsByClassName('btn-remove')[0].addEventListener('click', removeCartItem);
    cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantityChanged);
}

function updateCartTotal(){
    let cartItemContainer = document.getElementsByClassName('cart-items')[0];
    let cartRows = cartItemContainer.getElementsByClassName('cart-row');
    let total = 0;
    for (let i = 0; i < cartRows.length; i++) {
        let cartRow = cartRows[i];
        let priceElement = cartRow.getElementsByClassName('cart-price')[0];
        let quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0];
        let price = parseFloat(priceElement.innerText.replace('$', ''));
        let quantity = quantityElement.value;
        total = total + (price * quantity);
    }
    total = Math.round(total * 100) / 100;
    document.getElementsByClassName('cart-total-price')[0].innerText = '$' + total; 
}

function quantityChanged(e) {
    let input = e.target;
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1;
    }
    updateCartTotal();
}