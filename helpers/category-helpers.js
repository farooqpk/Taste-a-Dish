var db=require('../config/connection')
var collection=require('../config/collections')
var objectId=require('mongodb').ObjectId
const bcrypt = require("bcrypt");

module.exports={

    addCategory:(category)=>{
         return new Promise((resolve,reject)=>{
            db.get().collection(collection.CATEGORY_COLLECTIONS).insertOne(category).then((data)=>{
                resolve(data.insertedId)
            })
         })
    },

    getAllCategory:()=>{
        return new Promise(async(resolve,reject)=>{
      let category=  await db.get().collection(collection.CATEGORY_COLLECTIONS).find().toArray()
      resolve(category)
        })
    }






















}