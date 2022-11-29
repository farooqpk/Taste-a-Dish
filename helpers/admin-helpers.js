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
},



removeUser:(userId)=>{
  return new Promise((resolve,reject)=>{
    db.get().collection(collection.USER_COLLECTIONS).deleteOne({_id:objectId(userId)}).then(()=>{
      resolve()
    })
  })
},

getoneUser:(userId)=>{
  return new Promise((resolve,reject)=>{
    db.get().collection(collection.USER_COLLECTIONS).findOne({_id:objectId(userId)}).then((user)=>{
      resolve(user)
    })
  })
},

editUser:(userId,userDetails)=>{
  return new Promise((resolve,reject)=>{
    db.get().collection(collection.USER_COLLECTIONS).updateOne({_id:objectId(userId)},
    {
      $set:{
        Name:userDetails.Name,
        Email:userDetails.Email,
        Number:userDetails.Number
      }
    }).then(()=>{
      resolve()
    })
  })
},


addbanner:(details)=>{
  return new Promise((resolve,reject)=>{
db.get().collection(collection.BANNER_COLLECTION).insertOne(details).then((data)=>{
  resolve(data.insertedId)
})
  })
},

getBanner:()=>{
  return new Promise((resolve,reject)=>{
db.get().collection(collection.BANNER_COLLECTION).find().toArray().then((banner)=>{
  resolve(banner)
})
  })
},

requiredBanner:(bannerId)=>{
  return new Promise((resolve,reject)=>{
    db.get().collection(collection.BANNER_COLLECTION).findOne({_id:objectId(bannerId)}).then((banner)=>{
      resolve(banner)
    })
  })
},

editBanner:(bannerId,bannerDetail)=>{
  return new Promise((resolve,reject)=>{
    db.get().collection(collection.BANNER_COLLECTION).updateOne({_id:objectId(bannerId)},
    {
      $set:{
        short_name:bannerDetail.short_name,
        head_name:bannerDetail.head_name
      }
    }).then((data)=>{
      resolve(data.insertedId)
    })
  })
},

removeBanner:(bannerId)=>{
  return new Promise((resolve,reject)=>{
    db.get().collection(collection.BANNER_COLLECTION).deleteOne({_id:objectId(bannerId)}).then(()=>{
      resolve()
    })
  })
},

changeUserStatus:(userId,Status)=>{
  return new Promise((resolve,reject)=>{
    db.get().collection(collection.USER_COLLECTIONS).updateOne({_id:objectId(userId)},
    {
      $set:{
        userStatus:Status
      }
    }).then(()=>{
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





















