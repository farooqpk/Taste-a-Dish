
var db = require('../config/connection')
var collection = require('../config/collections')
var objectId = require('mongodb').ObjectId
module.exports = {

    addProduct: (product) => {
        return new Promise((resolve, reject) => {
            db.get().collection('product').insertOne(product).then(() => {

                resolve()
            })
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

            if (proDetails.url == null) {

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
            } else {

                db.get().collection(collection.PRODUCT_COLLECTIONS).updateOne({ _id: objectId(prodId) }, {
                    $set: {
                        Name: proDetails.Name,
                        Description: proDetails.Description,
                        Price: proDetails.Price,
                        Category: proDetails.Category,
                        publicId: proDetails.publicId,
                        url: proDetails.url
                    }
                }).then((response) => {
                    resolve()
                })
            }
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
            db.get().collection(collection.CATEGORY_COLLECTIONS).insertOne(category).then(() => {
                resolve()
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