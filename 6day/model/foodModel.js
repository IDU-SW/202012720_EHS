const fs = require('fs');

class Food {
    constructor() {
        const data = fs.readFileSync('./model/data.json');
        this.foods = JSON.parse(data)
    }

    getFoodList() {
        if (this.foods) {
            return this.foods;
        }
        else {
            return [];
        }
    }

    getFoodDetail(foodId) {
        return new Promise((resolve, reject) => {
            for (var food of this.foods ) {
                if ( food.id == foodId ) {
                    resolve(food);
                    return;
                }
            }
            reject({msg:'Can not find detail food', code:404});
        });
    }

    addFood(food, kind, explanation) {
        return new Promise((resolve, reject) => {
            let last = this.foods[this.foods.length - 1];
            let id = last.id + 1;
            let newFood = {id, food, kind, explanation};
            this.foods.push(newFood);

            resolve(newFood);
        });
    }

    updateFood(foodId, done) {
        return new Promise((resolve, reject) => {
            for (var food of this.foods ) {
                if ( food.id == foodId ) {
                    food.done = done;
                    resolve(food);
                    return;
                }
            }
            reject({msg:'Can not update food', code:404});
        });
    }

    deleteFood(foodId) {
        return new Promise((resolve, reject) => {
            for (var food of this.foods ) {
                if ( food.id == foodId ) {
                    this.foods.pop(food);
                    resolve(food);
                    return;
                }
            }
            reject({msg:'Can not find that named food', code:404});
        });
    }
}

module.exports = new Food();