const fs = require('fs');
const Sequelize = require('sequelize');
const sequelize = new Sequelize('Food', 'hak', 'cometrue', {
    dialect: 'mysql', host: '127.0.0.1'
});

class Foods extends Sequelize.Model {}
Foods.init({
    id: {
        type: Sequelize.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true
    },
    name: Sequelize.STRING,
    kind: Sequelize.STRING,
    explanation: Sequelize.STRING,
   
}, {tableName:'food', sequelize, timestamps: false});

class FoodImage extends Sequelize.Model {}
FoodImage.init({
    id: {
        type: Sequelize.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true
    },
    fk_food_id: Sequelize.INTEGER,
    image: Sequelize.STRING
}, {tableName:'foodImage', sequelize, timestamps: false});

class Food {
    constructor() {
        try {
            this.prepareModel();
        } catch (error) {
            console.error(error);    
        }
    }

    async prepareModel() {
        try {
            await Foods.sync({force:true});
            await FoodImage.sync({force:true});

            Foods.hasOne(FoodImage, {
                foreignKey:'fk_food_id',
                onDelete:'cascade'
            });

            await this.allDataInsert(); 
        }
        catch (error) {
            console.log('Foods.sync Error ', error);
        }
    }

   
    async allDataInsert() {
        const data = fs.readFileSync('./model/data.json');
        const foods = JSON.parse(data);
        for (var food of foods ) {
            await this.oneDataInsert(food);
        }
    }

   
    async oneDataInsert(food) {
        try {
            let charData = await Foods.create({ 
                            name : food.name, 
                            kind : food.kind, 
                            explanation : food.explanation,                           
                        }, {logging:false});
            let imageData = await FoodImage.create({
                            image : food.thumbnail
                        }, {logging:false});
            const newData = charData.dataValues;
            console.log('oneDataInsert : ', newData);
            
            await charData.setFoodImage(imageData);

            return newData;
        } catch (error) {
            console.error(error);
        }
    }

   
    async getFoodList() {
        let returnValue;
        await Foods.findAll({})
        .then( results => {
            for (var item of results) {
                console.log('id:', item.id, ' name:', item.name);
            }
            returnValue = results;
        })
        .catch( error => {
            console.error('Error :', error);
        });
        return returnValue;
    }

   
    async addFood(name, kind, explanation,  thumbnail) {
        const newFood = {name, kind, explanation,  thumbnail};
        try {
            const returnValue = await this.oneDataInsert(newFood);
            return returnValue;
        } catch (error) {
            console.error(error);
        }
    }

   
    async getFoodDetail(foodId) {
        try {
            const ret = await Foods.findAll({
                where:{id:foodId},
                include: [{model:FoodImage}]
            });

            if ( ret ) {
                return ret[0];
            }
            else {
                console.log('no data');
            }
        }
        catch (error) {
            console.log('Error :', error);
        }
    }

   
    async updateFood(foodId, name, kind, explanation,  thumbnail) {
        try {
            let food = await this.getFoodDetail(foodId); 
            food.dataValues.name = !name ? food.name : name;
            food.dataValues.kind = !kind ? food.kind : kind;
            food.dataValues.explanation = !explanation ? food.explanation : explanation;
           
            if(thumbnail)   
            {
                const imageData = await FoodImage.findByPk(food.FoodImage.dataValues.id);
                imageData.image = thumbnail;
                await imageData.save(); // 

                food.FoodImage.dataValues.image = thumbnail;  
            }
            let ret = await food.save();  
            return ret;      
        } catch (error) {
            console.error(error);  
        }
    }


    async deleteFood(foodId) {
        try {
            let result = await Foods.destroy({where: {id:foodId}});
            console.log('Remove success :', foodId);
        } catch (error) {
            console.error(error);  
        }
    }
}

module.exports = new Food();