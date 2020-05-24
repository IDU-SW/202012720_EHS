var MongoClient = require('mongodb').MongoClient
var url = 'mongodb://localhost:27017/example';
var ObjectID = require('mongodb').ObjectID;

var db;

MongoClient.connect(url, { useUnifiedTopology: true }, function (err, database) {
    if (err) {
        console.error('MongoDB 연결 실패', err);
        return;
    }
  
    db = database.db('example');
});

class Food {}


Food.getFoodList = async () => {
    return await db.collection('food').find({}).toArray();
}

Food.getFoodDetail = async (foodId) => {
    return await db.collection('food').findOne({ _id: new ObjectID(foodId) });
}

Food.addFood = async (name, kind, explanation) => {
    const data = { name, kind, explanation };
    try {
        const returnValue = await dataOneAdd(data);
        return returnValue;
    } catch (error) {
        console.error(error);
    }
}

async function dataOneAdd(food) {
    try {
        let foodData = await db.collection('food').insertOne({
            name: food.name,
            kind: food.kind,
            explanation: food.explanation
        }, { logging: false });
        const newFood = foodData;
        console.log('입력된 데이터 : ', newFood);
        return newFood;
    } catch (error) {
        console.log(error);
    }
}

Food.deleteFood = async (foodId) => {
    try {
        let result = await db.collection('food').deleteOne({ _id: new ObjectID(foodId) });
        console.log('삭제한 id : ', _id);
    } catch (error) {
        console.log(error);
    }
}

Food.updateFood = async (foodId, name, kind, explanation) => {
    try {
        let ret = await db.collection('food').updateOne({_id: new ObjectID(foodId)}, {$set : {name: name, kind: kind, explanation: explanation}});
        console.log('ret 값 : ', ret);
        return ret;
    } catch (error) {
        console.log(error);
    }
}

module.exports = new Food();