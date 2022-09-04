const {ObjectId} = require('mongodb');
const db = require('../database');

const Router = require('express').Router;

const router = Router();

router.get('/', (req, res, next) => {

  const queryPage = req.query.page;
  const pageSize = 5;
  // let resultProducts = [...products];
  // if (queryPage) {
  //   resultProducts = products.slice(
  //     (queryPage - 1) * pageSize,
  //     queryPage * pageSize
  //   );
  // }
  // res.json(resultProducts);

  const products = [];

  db.getDb()
    .db()
    .collection('products')
    .find()
    .sort({price: -1})
    .skip((queryPage - 1) * pageSize)
    .limit(pageSize)
    .forEach(product => {
      products.push(product)
    })
    .then(result => {
      res.status(200).json(products)
    })
    .catch(error => {
      res.status(500).json({
        message: "An Error ocurred"
      })
    })

});

router.get('/:id', (req, res, next) => {
  db.getDb()
    .db()
    .collection("products")
    .findOne({
      _id: new ObjectId(req.params.id)
    })
    .then(product => {
      product.price = product.price.toString;
      res.status(200).json(product);
    })
    .catch(error => {
      res.json(500).json({
        message: "An error occurred"
      })
    })
});

router.post('', (req, res, next) => {

  const newProduct = {
    name: req.body.name,
    description: req.body.description,
    price: parseFloat(req.body.price), // store this as 128bit decimal in MongoDB
    image: req.body.image
  };

  db.getDb()
    .db()
    .collection('products')
    .insertOne(newProduct)
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: 'Product added'
      });
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({
        message: 'An Error occurred'
      });
    })


});

router.patch('/:id', (req, res, next) => {
  const updatedProduct = {
    name: req.body.name,
    description: req.body.description,
    price: parseFloat(req.body.price), // store this as 128bit decimal in MongoDB
    image: req.body.image
  };

  db.getDb()
    .db()
    .collection("products")
    .updateOne({
      _id: new ObjectId(req.params.id)
    }, {
      $set: updatedProduct
    })
    .then(result => {
      res.status(200).json({
        message: "Product updated",
        id: req.params.id
      })
    }).catch(error => {
      res.status(500).json({
        message: "An error occured."
      })
    })
});

router.delete('/:id', (req, res, next) => {
  db.getDb()
    .db()
    .collection("products")
    .deleteOne({
      _id: new ObjectId(req.params.id)
    })
    .then(result => {
      res.status(200).json({
        message: "Product deleted"
      })
    })
    .catch(error => {
      res.status(500).json({
        message: "An error occured."
      })
    })
});

module.exports = router;