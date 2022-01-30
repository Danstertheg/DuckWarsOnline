class itemShop{
    constructor(items=[])
    {
        this.items = [];
    }
    addItem(newItem){
        this.items.push(newItem);
    }
    removeItem(itemIndex){
        this.items.splice(itemIndex,1);
    }
}