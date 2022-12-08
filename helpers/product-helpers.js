
var db = require('../config/connection')
var collection = require('../config/collections')
var objectId = require('mongodb').ObjectId
module.exports = {

    addProduct: (product, callback) => {
        let prodDetails = {
            Name: product.Name,
            Category: product.Category,
            Price: product.Price,
            Description: product.Description,
            popular: "false",
            Date: new Date()
        }
        db.get().collection('product').insertOne(prodDetails).then((data) => {

            callback(data.insertedId)
        })
    },
    getAllProducts: () => {
        return new Promise(async (resolve, reject) => {
            let products = await db.get().collection(collection.PRODUCT_COLLECTIONS).find().toArray()
            resolve(products)
        })
    },

    deleteProduct: (prodId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTIONS).deleteOne({ _id: objectId(prodId) }).then((response) => {
                ///console.log(response);
                resolve(response)
            })
        })
    },

    getProductDetails: (prodId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTIONS).findOne({ _id: objectId(prodId) }).then((product) => {
                resolve(product)
            })
        })
    },
    updateProduct: (prodId, proDetails) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTIONS).updateOne({ _id: objectId(prodId) }, {
                $set: {
                    Name: proDetails.Name,
                    Description: proDetails.Description,
                    Price: proDetails.Price,
                    Category: proDetails.Category
                }
            }).then((response) => {
                resolve()
            })
        })
    },


    popularDish: (proId, popularStatus) => {
        return new Promise((resolve, reject) => {

            db.get().collection(collection.PRODUCT_COLLECTIONS).updateOne({ _id: objectId(proId) }, {
                $set: { popular: popularStatus }
            }).then(() => {
                resolve()
            })
        })
    },


    getPopularDishes: () => {
        return new Promise(async (resolve, reject) => {
            let popularDishes = await db.get().collection(collection.PRODUCT_COLLECTIONS).find({ popular: "true" }).toArray()
            if (popularDishes) {
                resolve(popularDishes)
            } else {
                reject()
            }

        })
    },


    addCategory: (category) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.CATEGORY_COLLECTIONS).insertOne(category).then((data) => {
                resolve(data.insertedId)
            })
        })
    },

    getAllCategory: () => {
        return new Promise(async (resolve, reject) => {
            let category = await db.get().collection(collection.CATEGORY_COLLECTIONS).find().toArray()
            resolve(category)
        })
    }






















}