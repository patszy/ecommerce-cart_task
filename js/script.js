const items = [
    { "id": "game-item-1", "img": "./img/game-1.png", "name": "Oddworld: stranger's wrath", "sale": true, "price": "9.99", "owned": false, "inCart": false },
    { "id": "game-item-2", "img": "./img/game-2.png", "name": "Chaos of deponia", "sale": false, "price": "5.99", "owned": true, "inCart": false },
    { "id": "game-item-3", "img": "./img/game-3.png", "name": "The settlers 2: gold edition", "sale": false, "price": "9.99", "owned": false, "inCart": false },
    { "id": "game-item-4", "img": "./img/game-4.png", "name": "Neverwinter nights", "sale": true, "price": "4.99", "owned": false, "inCart": false },
    { "id": "game-item-5", "img": "./img/game-5.png", "name": "Assassin's creed: director's cut", "sale": true, "price": "13.99", "owned": false, "inCart": false }
]

const gameWrapper = document.querySelector(".game-wrapper");
const clearCard = document.querySelector(".clear-card");
const basketItemsWrapper = document.querySelector(".basket-items-wrapper");

let gamesPriceSum = document.querySelector("#game-price-sum");
let gamesAmount = document.querySelectorAll(".games-amount");
let convertToNumber = [];

class ShopItem {
    constructor(obj) {
      this.id = obj.id;
      this.img = obj.img;
      this.price = obj.price;
      this.sale = obj.sale;
      this.owned = obj.owned;
      this.inCart = obj.inCart;
      this.name = obj.name;
    }

    renderBasketItemTemplate(obj) {
        return basketItemsWrapper.innerHTML += `<div id="basket-${obj.id}" class="basket-item">
            <img src="${obj.img}" alt="${obj.id}">
            <p>${obj.name}</p>
            <p>
                <span class="game-delete">Delete</span>
                <span class="basket-game-price">$${obj.price}</span>
            </p>
        </div>`;
    }

    renderShopItemTemplate(obj) {
        return gameWrapper.innerHTML += `<figure class="game-item">
            <div id="${obj.id}" class="game-items"></div>
            <figcaption>
                <p class="game-item-name">${obj.name}</p>
                <p class="game-item-btns">
                    <span class="game-btn game-price-self">${obj.price}</span>
                </p>
            </figcaption>
        </figure>`;
    }
}

const basket = () => {
    showBasketPanel = () => {
        document.querySelector(".basket-dropdown").style.display = "block";
    }

    hideBasketPanel = () => {
        document.querySelector(".basket-dropdown").style.display = "none";
    }

    clearBasket = () => {
        basketItemsWrapper.style.display = "none";
        gamesAmmount.forEach(element => element.innerHTML = 0)
        gamesPriceSum.innerHTML = "";
        convertToNumber = [];

        gameWrapper.innerHTML = "";

        for(let i in items) {
            items[i].inCart = false;
        }

        shop();
    }

    deleteBasketItem = (e) => {
        let currentBasketItem = e.toElement.closest(".basket-item");

        for (let i in items) {
            if (items[i].id === currentBasketItem.id.slice(7)) {
                currentBasketItem.style.display = "none";

                gamesAmount.forEach(element => {
                    let counter = Number(element.innerHTML) - 1;
                    element.innerHTML = counter;
                })

                let currentItemPrice = Number(e.toElement.closest(".basket-item").querySelector(".basket-game-price").innerHTML.slice(1));
                let allItemPrice = Number(gamesPriceSum.innerHTML.slice(1));

                if(currentItemPrice > allItemPrice) {
                    gamesPriceSum.innerHTML = Number(0).tofixed(2);
                } else {
                    gamesPriceSum.innerHTML = `$${Number(allItemPrice - currentItemPrice).toFixed(2)}`;
                }
            }
        }
    }

    loadEventListeners = () => {
        document.querySelector(".toggle-panel").addEventListener("mouseover", showBasketPanel);
        document.querySelector(".basket-dropdown").addEventListener("mouseover", showBasketPanel);
        // document.querySelector(".toggle-panel").addEventListener("mouseleave", hideBasketPanel);
        document.querySelector(".basket-dropdown").addEventListener("mouseleave", hideBasketPanel);
        clearCard.addEventListener("click", clearBasket);
    };

    return {
        loadEventListeners: loadEventListeners()
    }
};

const shop = () => {

    const showShopItems = () => {
        for(let i in items) {
            let item = new ShopItem(items[i]);

            item.renderShopItemTemplate(item);

            itemStatus = document.querySelector(`#${item.id}`).nextElementSibling.querySelector(".game-item-btns");

            gameWrapper.querySelector(`#${item.id}`).style.backgroundImage = `url(${item.img})`;

            if(item.inCart === true) {
                item.renderBasketItemTemplate(item);
                itemStatus.innerHTML = `<span class="game-price-self game-btn>In cart</span>`;
            } else {
                itemStatus.innerHTML = `<span class="game-price-self game-btn">$${item.price}</span>`
            }

            if(item.sale === true) {
                itemStatus.insertAdjacentHTML("afterbegin", `<span class="game-btn sale">-${50}%</span>`)
            }

            if(item.owned === true) {
                itemStatus.innerHTML = `<span class="game-price-self game-btn">Owned</span>`;
            }

            if(item.owned == false && item.inCart === false) {
                const priceStatus = itemStatus.querySelector(".game-price-self").classList.add("game-price");
            }
        }

        const renderedItems = document.querySelectorAll(".game-price");

        renderedItems.forEach(elem => {
            const elemItem = elem.closest("figcaption").previousElementSibling;

            for(let i in items) {
                if(elemItem.id === items[i].id) {
                    elem.addEventListener("click", () => {
                        if(items[i].inCart === false) {
                            const currentObj = new ShopItem(items[i]);
                            currentObj.renderBasketItemTemplate(currentObj);

                            items[i].inCart = true;

                            deleteItem = document.querySelectorAll(".game-delete");
                            deleteItem.forEach(element => element.addEventListener("click", deleteBasketItem));

                            const shopGamePrice = document.createElement("span");
                            shopGamePrice.classList.add("basket-game-price");
                            shopGamePrice.innerHTML = items[i].price;
                            convertToNumber.push(Number(shopGamePrice.innerHTML));

                            elem.innerHTML = "In Cart";
                            let sale = elem.previousSibling;
                            (sale)? sale.style.display = "none" : false;

                            document.querySelectorAll(".games-amount").forEach(element => {
                                let counter = Number(element.innerHTML) + 1;
                                element.innerHTML = counter;
                            });

                            if(convertToNumber.length >= 1) {
                                gamesPriceSum.innerHTML = `$${convertToNumber.reduce((a, b) => (a+b))}`;
                            }
                        }
                    });
                }
            }
        });
    }

    showShopItems();
}

const init = () => {
    basket();
    shop();
}

document.addEventListener("DOMContentLoaded", () => {
    init();
});