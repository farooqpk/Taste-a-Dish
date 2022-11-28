var db=require('../config/connection')
var collection=require('../config/collections')
var objectId=require('mongodb').ObjectId
const bcrypt = require("bcrypt");
const { FindCursor } = require('mongodb');

module.exports={

    viewOrderDetails:()=>{
        return new Promise(async(resolve,reject)=>{
          let orderList=await  db.get().collection(collection.ORDER_COLLECTIONS).
          find().sort({'date':-1}).toArray()
            resolve(orderList)
        })
    },

    getOrderedProducts:(orderId)=>{
        return new Promise(async(resolve,reject)=>{
            let orderItems=await db.get().collection(collection.ORDER_COLLECTIONS).aggregate([
              {
                $match: { _id: objectId(orderId) },
              },{
                $unwind:'$products'
              },{
                $project:{
                  item:'$products.item',
                  quantity:'$products.quantity'
                }
              },{
                $lookup:{
                  from:collection.PRODUCT_COLLECTIONS,
                  localField:'item',
                  foreignField:'_id',
                  as:'product'
                }
                },{
                  $project:{
                    item:1,
                    quantity:1,
                    product:{$arrayElemAt:['$product',0]}
                  }
                }
              
            ]).toArray();
           
          resolve(orderItems);
        
          })
    },

    changeOrderStatus:(orderId,status)=>{
      console.log(status);
      console.log(orderId);
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.ORDER_COLLECTIONS).updateOne({_id:objectId(orderId)},
            {
                $set:{
                    status:status.status
                }
            }).then(()=>{
                resolve()
            })
            
        })
    },

dologin:(adminData)=>{
  return new Promise(async (resolve, reject) => {
    let loginStatus = false;
    let response = {};
    let admin = await db
      .get()
      .collection(collection.ADMIN_COLLECTIONS)
      .findOne({ Email: adminData.Email });
    if (admin) {
      bcrypt.compare(adminData.Password, admin.Password).then((status) => {
        if (status) {
          console.log("login success");
          response.admin = admin;
          response.status = true;
          resolve(response);
        } else {
          console.log("login failed");
          resolve({ status: false });
        }
      });
    } else {
      console.log("login failed");
      resolve({ status: false });
    }
  });

},

allUserDetails:()=>{
  return new Promise(async(resolve,reject)=>{
  let users=await db.get().collection(collection.USER_COLLECTIONS).find().toArray()

  resolve(users)
  })
},

allCategory:()=>{
  return new Promise((resolve,reject)=>{
  db.get().collection(collection.CATEGORY_COLLECTIONS).find().toArray().then((category)=>[
resolve(category)
  ])
  })
},

specificCategory:(catId)=>{
  return new Promise((resolve,reject)=>{
    console.log(catId);
    db.get().collection(collection.CATEGORY_COLLECTIONS).findOne({_id:objectId(catId)}).then((category)=>{
      resolve(category)
    })
  })
},

editCategory:(catId,catName)=>{
  return new Promise((resolve,reject)=>{
    db.get().collection(collection.CATEGORY_COLLECTIONS).updateOne({_id:objectId(catId)},
    {
      $set:{
        cat_name:catName
      }
    }).then(()=>{
      resolve()
    })
  })
},

removeCategory:(catId)=>{
  return new Promise((resolve,reject)=>{
    db.get().collection(collection.CATEGORY_COLLECTIONS).deleteOne({_id:objectId(catId)}).then(()=>{
      resolve()
    })
  })
}














}
/*
dosignup:(adminData)=>{
  return new Promise(async (resolve, reject) => {
    adminData.Password = await bcrypt.hash(adminData.Password, 10);
    db.get()
      .collection(collection.ADMIN_COLLECTIONS)
      .insertOne(adminData)
      .then((data) => {
        resolve(adminData);
      });
  });
}
*/





















