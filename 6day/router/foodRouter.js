const express = require('express');
const router = express.Router();
const foods = require('../model/foodModel');

router.get('/foods', showFoodList);
router.get('/foods/:foodId', showFoodDetail);
router.post('/foods', addFood);
router.put('/foods', updateFood);
router.delete('/foods/:foodId', deleteFood);

module.exports = router;


function showFoodList(req, res) {
    const foodList = foods.getFoodList();
    const result = { data:foodList, count:foodList.length };
    res.send(result);
}


async function showFoodDetail(req, res) {
    try {
        
        const foodId = req.params.foodId;
        const info = await foods.getFoodDetail(foodId);
        res.send(info);
    }
    catch ( error ) {
        console.log('Can not find, 404');
        res.status(error.code).send({msg:error.msg});
    }
}

// 음식 추가
async function addFood(req, res) {
    const food = req.body.food;

    if (!food) {
        res.status(400).send({error:'food 누락'});
        return;
    }

    const kind = req.body.kind;
    const explanation = req.body.explanation;
    

    try {
        const result = await foods.addFood(food, kind, explanation);
        res.send({msg:'success', data:result});
    }
    catch ( error ) {
        res.status(500).send(error.msg);
    }
}

// 음식 수정
async function updateFood(req, res) {
    const id = req.body.id;

    if (!id) {
        res.status(400).send({error:'누락'});
        return;
    }
    const done = req.body.done;

    try {
        const result = await foods.updateFood(id, done);
        res.send({msg:'success', data:result});
    }
    catch ( error ) {
        res.status(500).send(error.msg);
    }
}
// 음식 삭제
async function deleteFood(req, res) {
    const id = req.params.foodId;
    try {
        const result = await foods.deleteFood(id);
        res.send('success');
    }
    catch ( error ) {
        res.status(500).send(error.msg);
    }
}