class Item{
    constructor(itemId, img, price = 0){
        this.id = itemId;
        this.img = img;
        this.price = price;
    }
    setPrice(newPrice){
        this.price = newPrice
    }
}
module.exports = Item