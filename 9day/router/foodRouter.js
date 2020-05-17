const express = require('express');
const router = express.Router();
const foods = require('../model/foodModel');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null,'./uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  });
const upload = multer({ storage : storage });


router.get('/Food', showFoodList);
router.get('/Food/:foodId', showFoodDetail);
router.get('/FoodAdd', showAddForm);
router.get('/FoodUpdate/:foodId', showUpdateForm);
router.post('/Food', upload.single('thumbnail'), addFood);
router.post('/Food/:foodId', deleteFood);

router.post('/FoodUpdate/:foodId', upload.single('thumbnail'), updateFood);

module.exports = router;



async function showFoodList(req, res) {
    try {
        const foodList = await foods.getFoodList();
        const result = { data:foodList, count:foodList.length };
        res.render('FoodList', { data:foodList });
    } catch ( error ) {
        console.log('Can not find, 404');
        res.status(error.code).send({msg:error.msg});
    }
}
function showAddForm(req, res) {
    res.render('AddFood');
}



async function addFood(req, res) {
    const name = req.body.name;
    const kind = req.body.kind;
    const explanation = req.body.explanation;
 

    if (!name || !kind || !explanation) {
        res.status(400).send({error:'모든 정보를 다 입력하세요.'});
        return;
    }

    const image = req.file;
    if(!image) {
        res.status(400).send({error:'이미지가 없습니다.'});
        return;
    }
    const thumbnail = image.originalname;

    try {
        const result = await foods.addFood(name, kind, explanation, thumbnail);
        showFoodList(req, res);
    }
    catch ( error ) {
        res.status(500).send(error.msg);
    }
}

async function showFoodDetail(req, res) {
    try {
        const foodId = req.params.foodId;
        const info = await foods.getFoodDetail(foodId);
        res.render('FoodDetail', { data:info.dataValues, image:info.FoodImage.dataValues });
    } catch ( error ) {
        console.log('Can not find, 404');
        res.status(error.code).send({msg:error.msg});
    }
}


async function showUpdateForm(req, res) {
    try {
        const foodId = req.params.foodId;
        console.log('foodId : ', foodId);
        const info = await foods.getFoodDetail(foodId);
        console.log('name : ', info.name);
        res.render('FoodUpdate', { data:info.dataValues, image:info.FoodImage.dataValues });
    }
    catch ( error ) {
        console.log('Can not find, 404');
        res.status(error.code).send({msg:error.msg});
    }
}



async function updateFood(req, res) {
    const id = req.params.foodId;  
    console.log("update : " + id);
    
    const name = req.body.name;
    const kind = req.body.kind;
    const explanation = req.body.explanation;
   

    const image = req.file;
    const thumbnail = !image ? null : image.originalname;

    try {
        const result = await foods.updateFood(id, name, kind, explanation,  thumbnail);
        res.render('FoodDetail', { data:result.dataValues, image:result.FoodImage.dataValues });
    }
    catch ( error ) {
        res.status(500).send(error.msg);
    }
}

async function deleteFood(req, res) {
    try {
        const id = req.params.foodId;
        const result = await foods.deleteFood(id);
        res.render('FoodDeleteComplete', {data:result})
    }
    catch(error) {
        res.status(500).send(error.msg);
    }
}