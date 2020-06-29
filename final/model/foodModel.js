const fs = require('fs');

const Sequelize = require('sequelize');
const sequelize = new Sequelize('Foods', 'hak', 'cometrue', {
    dialect: 'mysql', host: '127.0.0.1'
});

class Foods extends Sequelize.Model { }
    Foods.init({
        id: { 
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        food: Sequelize.STRING,
        kind: Sequelize.STRING,
        explanation: Sequelize.STRING
    }, {tableName:'foods', sequelize, timestamps: false});



class Food {
    constructor() {
        const data = fs.readFileSync('./model/data.json');
        this.foods = JSON.parse(data)
    }

    async oneDataInsert(food) {
        try {
            let foodData = await Foods.create({ 
                            food : food.food, 
                            kind : food.kind, 
                            explanation : food.explanation
                        }, {logging:false});
            const newData = foodData.dataValues;

            return newData;
        } catch (error) {
            console.error(error);
        }
    }

    async allDataInsert() {
        const data = fs.readFileSync('./model/data.json');
        const foods = JSON.parse(data);
        for (var food of foods ) {
            await this.oneDataInsert(food);
        }
    }

    
    getFoodList = async() => {
        let returnValue;
        await Foods.findAll({})
        .then( results => {
            returnValue = results;
        })
        .catch( error => {
            console.error('Error :', error);
        });
        return returnValue;
    }

    addFood = async(food, kind, explanation) => {
    
        const foods = {food, kind, explanation};
        try {
            const returnValue = await this.oneDataInsert(foods);
            console.log(returnValue);
            return returnValue;
        } catch (error) {
            console.error(error);
        }
    }

    
    getFoodDetail = async(foodId) => {
        try {
            const ret = await Foods.findAll({
                where:{id:foodId}
            });

            if ( ret ) {
                return ret[0];
            }
            else {
                console.log('데이터 없음');
            }
        }
        catch (error) {
            console.log('Error :', error);
        }
    }

    deleteFood = async(foodId) => {
       
        try {
            let result = await Foods.destroy({where: {id:foodId}});
        } catch (error) {
            console.error(error);  
        }
    }

    updateFood = async(foodId, food, kind, explanation) => {
      

        try {
            let food = await this.getFoodDetail(foodId);
            food.dataValues.food = !food ? food.food : food;
            food.dataValues.kind = !kind ? food.kind : kind;
            food.dataValues.explanation = !explanation ? food.explanation : explanation;

            let ret = await food.save();
            return ret;
        } catch (error) {
            console.error(error);  
        }
    }
}

module.exports = new Food();