const express = require('express');
const router = express.Router();
const foods = require('../model/foodModel');

router.get('/foods', showFoodList);
router.get('/foods/:foodId', showFoodDetail);
router.post('/foods', addFood);
router.get('/food/add', addFoodForm);
router.delete('/foods/:foodId', deleteFood);
router.post('/foods/delete', deleteFood);
router.put('/foods', updateFood);
router.get('/food/detail/:foodId', updateFoodform);
router.post('/foods/edit', updateFood);
module.exports = router;





function showFoodList(req, res) {
    const foodList = foods.getFoodList();
    res.render('food', {foods:foodList, count:foodList.length})
}

async function showFoodDetail(req, res) {
    try {
        
        const foodId = req.params.foodId;
        console.log('foodId : ', foodId);
        const info = await foods.getFoodDetail(foodId);

        res.render('foodDel', {detail:info});
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
        res.status(400).send({error:'누락'});
        return;
    }

    const kind = req.body.kind;
    const explanation = req.body.explanation;
    

    try {
        const result = await foods.addFood(food, kind, explanation);
        res.render('addComplete',{data:result});
    }
    catch ( error ) {
        res.status(500).send(error.msg);
    }
}
function addFoodForm(req, res) {
    res.render('foodAdd');
}



// 음식 수정

async function updateFoodform(req, res) {
    try {
       
        const foodId = req.params.foodId;
        console.log('foodId : ', foodId);
        const info = await foods.getFoodDetail(foodId);

        res.render('foodUpdate', {detail:info});
    }
    catch ( error ) {
        console.log('Can not find, 404');
        res.status(error.code).send({msg:error.msg});
    }
}

// 수정
async function updateFood(req, res) {

    const id = req.body.id; // id 가져오기
    const food = req.body.food;

    if (!food) {
        res.status(400).send({error:'food 누락'});
        return;
    }
    const kind = req.body.kind;
    const explanation = req.body.explanation;
  

    try {
        const result = await foods.updatefood(id, food, kind, explanation);
        console.log(result);
        res.render('updateComplete',{data:result});
    }
    catch ( error ) {
        res.status(500).send(error.msg);
    }
}
// 음식 삭제

async function deleteFood(req, res) {
    try {
        const id = req.body.id; 
        const result = await foods.deleteFood(id);
        res.render('delComplete');
    }
    catch ( error ) {
        res.status(400).send({error:'음식 삭제실패'});
    }
}