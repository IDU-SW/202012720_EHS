const express = require('express');
const router = express.Router();
const foods = require('../model/foodModel');


router.get('/foods', async (req, res) => {
    const data = await foods.getFoodList();

    res.render('food', {foods:data, count:data.length});
});

router.get('/food/add', addFoodForm);
router.get('/foods/:foodId', showFoodDetail);
router.post('/foods', addFood);
router.delete('/foods/:foodId', deleteFood);
router.post('/foods/delete', deleteFood);
router.get('/food/detail/:foodId', updateFoodform);
router.post('/foods/edit', updateFood);
module.exports = router;



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


async function addFood(req, res) {
    const name = req.body.name;

    if (!food) {
        res.status(400).send({error:'누락'});
        return;
    }

    const kind = req.body.kind;
    const explanation = req.body.explanation;
    

    try {
        const result = await foods.addFood(name, kind, explanation);
        res.render('addComplete',{data:result});
    }
    catch ( error ) {
        res.status(500).send(error.msg);
    }
}
function addFoodForm(req, res) {
    res.render('foodAdd');
}



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

async function updateFood(req, res) {

    const id = req.body.id; // id 가져오기
    const name = req.body.name;

    if (!food) {
        res.status(400).send({error:'food 누락'});
        return;
    }
    const kind = req.body.kind;
    const explanation = req.body.explanation;
  

    try {
        const result = await foods.updateFood(id, name, kind, explanation);
        console.log(result);
        res.render('updateComplete',{data:result});
    }
    catch ( error ) {
        res.status(500).send(error.msg);
    }
}


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
