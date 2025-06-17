const express = require('express');
const router = express.Router();
const productController = require('../controller/product_controller');

router.post('/addproduct', productController.addproduct);
router.get('/getproduct', productController.getproduct);
router.put('/editproduct/:id', productController.editproduct);
router.delete('/deleteproduct/:id', productController.deleteproduct);
router.patch('/consumer/:id/quantity',productController.Consumer);

module.exports = router;
