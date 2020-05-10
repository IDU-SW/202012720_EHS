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

    updatefood(foodId, food, kind, explanation) {
        return new Promise((resolve, reject) => {
            let id = Number(foodId);
            let newFood = {id, food, kind, explanation};
            for (var food1 of this.foods ) {
                if ( food1.id == id ) {
                    this.foods.splice(id, 1, newFood); // 
                    resolve(newFood);
                    console.log(newFood);
                    return;
                }
            }
        });
    }

  
    deleteFood(id) {
        return new Promise((resolve, reject) => {
            for (var food of this.foods ) {
                if ( food.id == id ) {
                    this.foods.splice(id, 1);
                    resolve(food);
                    return;
                }
            }
            reject({msg:'Can not find food!', code:404});
        });
    }
}

module.exports = new Food();