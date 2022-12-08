var db = require('../config/connection')
var collection = require('../config/collections')
var objectId = require('mongodb').ObjectId
const bcrypt = require("bcrypt");
const { FindCursor } = require('mongodb');

module.exports = {

  viewOrderDetails: () => {
    return new Promise(async (resolve, reject) => {
      let orderList = await db.get().collection(collection.ORDER_COLLECTIONS).
        find().sort({ 'date': -1 }).toArray()
      resolve(orderList)
    })
  },

  getOrderedProducts: (orderId) => {
    return new Promise(async (resolve, reject) => {
      let orderItems = await db.get().collection(collection.ORDER_COLLECTIONS).aggregate([
        {
          $match: { _id: objectId(orderId) },
        }, {
          $unwind: '$products'
        }, {
          $project: {
            item: '$products.item',
            quantity: '$products.quantity'
          }
        }, {
          $lookup: {
            from: collection.PRODUCT_COLLECTIONS,
            localField: 'item',
            foreignField: '_id',
            as: 'product'
          }
        }, {
          $project: {
            item: 1,
            quantity: 1,
            product: { $arrayElemAt: ['$product', 0] }
          }
        }

      ]).toArray();

      resolve(orderItems);

    })
  },

  changeOrderStatus: (orderId, status) => {
    // console.log(status);
    // console.log(orderId);
    return new Promise((resolve, reject) => {
      db.get().collection(collection.ORDER_COLLECTIONS).updateOne({ _id: objectId(orderId) },
        {
          $set: {
            status: status.status
          }
        }).then(() => {
          resolve()
        })

    })
  },

  dologin: (adminData) => {
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
            // console.log("login success");
            response.admin = admin;
            response.status = true;
            resolve(response);
          } else {
            // console.log("login failed");
            resolve({ status: false });
          }
        });
      } else {
        // console.log("login failed");
        resolve({ status: false });
      }
    });

  },

  allUserDetails: () => {
    return new Promise(async (resolve, reject) => {
      let users = await db.get().collection(collection.USER_COLLECTIONS).find().toArray()

      resolve(users)
    })
  },

  allCategory: () => {
    return new Promise((resolve, reject) => {
      db.get().collection(collection.CATEGORY_COLLECTIONS).find().toArray().then((category) => [
        resolve(category)
      ])
    })
  },

  specificCategory: (catId) => {
    return new Promise((resolve, reject) => {
      // console.log(catId);
      db.get().collection(collection.CATEGORY_COLLECTIONS).findOne({ _id: objectId(catId) }).then((category) => {
        resolve(category)
      })
    })
  },

  editCategory: (catId, catName) => {
    return new Promise((resolve, reject) => {
      db.get().collection(collection.CATEGORY_COLLECTIONS).updateOne({ _id: objectId(catId) },
        {
          $set: {
            cat_name: catName
          }
        }).then(() => {
          resolve()
        })
    })
  },

  removeCategory: (catId) => {
    return new Promise((resolve, reject) => {
      db.get().collection(collection.CATEGORY_COLLECTIONS).deleteOne({ _id: objectId(catId) }).then(() => {
        resolve()
      })
    })
  },



  removeUser: (userId) => {
    return new Promise((resolve, reject) => {
      db.get().collection(collection.USER_COLLECTIONS).deleteOne({ _id: objectId(userId) }).then(() => {
        resolve()
      })
    })
  },

  getoneUser: (userId) => {
    return new Promise((resolve, reject) => {
      db.get().collection(collection.USER_COLLECTIONS).findOne({ _id: objectId(userId) }).then((user) => {
        resolve(user)
      })
    })
  },

  editUser: (userId, userDetails) => {
    return new Promise((resolve, reject) => {
      db.get().collection(collection.USER_COLLECTIONS).updateOne({ _id: objectId(userId) },
        {
          $set: {
            Name: userDetails.Name,
            Email: userDetails.Email,
            Number: userDetails.Number
          }
        }).then(() => {
          resolve()
        })
    })
  },


  addbanner: (details) => {
    return new Promise((resolve, reject) => {
      db.get().collection(collection.BANNER_COLLECTION).insertOne(details).then((data) => {
        resolve(data.insertedId)
      })
    })
  },

  getBanner: () => {
    return new Promise((resolve, reject) => {
      db.get().collection(collection.BANNER_COLLECTION).find().toArray().then((banner) => {
        resolve(banner)
      })
    })
  },

  requiredBanner: (bannerId) => {
    return new Promise((resolve, reject) => {
      db.get().collection(collection.BANNER_COLLECTION).findOne({ _id: objectId(bannerId) }).then((banner) => {
        resolve(banner)
      })
    })
  },

  editBanner: (bannerId, bannerDetail) => {
    return new Promise((resolve, reject) => {
      db.get().collection(collection.BANNER_COLLECTION).updateOne({ _id: objectId(bannerId) },
        {
          $set: {
            short_name: bannerDetail.short_name,
            head_name: bannerDetail.head_name
          }
        }).then((data) => {
          resolve(data.insertedId)
        })
    })
  },

  removeBanner: (bannerId) => {
    return new Promise((resolve, reject) => {
      db.get().collection(collection.BANNER_COLLECTION).deleteOne({ _id: objectId(bannerId) }).then(() => {
        resolve()
      })
    })
  },

  changeUserStatus: (userId, Status) => {
    return new Promise((resolve, reject) => {
      db.get().collection(collection.USER_COLLECTIONS).updateOne({ _id: objectId(userId) },
        {
          $set: {
            userStatus: Status
          }
        }).then(() => {
          resolve()
        })
    })
  },

  getAdminData: () => {
    return new Promise((resolve, reject) => {
      db.get().collection(collection.ADMIN_COLLECTIONS).findOne().then((admin) => {
        resolve(admin)
      })
    })
  },

  updateAdmin: (adminData, adminId) => {
    return new Promise((resolve, reject) => {
      db.get().collection(collection.ADMIN_COLLECTIONS).updateOne({ _id: objectId(adminId) },
        {
          $set: {
            Name: adminData.Name,
            Email: adminData.Email
          }
        }).then((data) => {
          resolve()
        })
    })
  },

  updateAdminPass: (passDetails, adminId) => {
    return new Promise(async (resolve, reject) => {
      passDetails.Password = await bcrypt.hash(passDetails.Password, 10);
      passDetails.newPassword = await bcrypt.hash(passDetails.newPassword, 10)

      let admin = await db.get().collection(collection.ADMIN_COLLECTIONS).findOne({ _id: objectId(adminId) })
      if (admin) {
        bcrypt.compare(passDetails.Password, admin.Password).then(() => {
          db.get().collection(collection.ADMIN_COLLECTIONS).updateOne({ _id: objectId(adminId) },
            {
              $set: {
                Password: passDetails.newPassword
              }
            }).then(() => {
              resolve()
            })
        })
      } else {
        reject(err)
      }

    })
  },

  getUserCount: () => {
    return new Promise((resolve, reject) => {
      db.get().collection(collection.USER_COLLECTIONS).count().then((count) => {
        resolve(count)
      })
    })
  },

  getOrderCount: () => {
    return new Promise(async (resolve, reject) => {
      let count = await db.get().collection(collection.ORDER_COLLECTIONS).count()
      resolve(count)
    })
  },

  getDishCount: () => {
    return new Promise(async (resolve, reject) => {
      let count = await db.get().collection(collection.PRODUCT_COLLECTIONS).count()
      resolve(count)
    })
  },
  getSaleCount: () => {
    return new Promise(async (resolve, reject) => {
      db.get().collection(collection.ORDER_COLLECTIONS).count({ status: "delivered" }).then((count) => {
        resolve(count)
      })
    })
  },

  getAllMessages: () => {
    return new Promise((resolve, reject) => {
      db.get().collection(collection.USER_MESSAGES).find().sort({ Date: -1 }).toArray().then((msg) => {
        resolve(msg)
      })
    })
  },

  getMsgCount: () => {
    return new Promise(async (resolve, reject) => {
      db.get().collection(collection.USER_MESSAGES).count().then((count) => {
        resolve(count)
      })
    })
  },


  removeMsg: (msgId) => {
    return new Promise(async (resolve, reject) => {
      db.get().collection(collection.USER_MESSAGES).deleteOne({ _id: objectId(msgId) }).then(() => {
        resolve()
      })
    })
  },

  getCodCount: () => {
    return new Promise(async (resolve, reject) => {
      db.get().collection(collection.ORDER_COLLECTIONS).count({ paymentMethod: "COD" }).then((count) => {
        resolve(count)
      })
    })
  },


  getOnlineCount: () => {
    return new Promise(async (resolve, reject) => {
      db.get().collection(collection.ORDER_COLLECTIONS).count({ paymentMethod: "ONLINE" }).then((count) => {
        resolve(count)
      })
    })
  },

  totalEarnings: () => {
    return new Promise(async (resolve, reject) => {
      let total = await db.get().collection(collection.ORDER_COLLECTIONS).aggregate([
        {
          $match: {
            $and: [
              {
                $or: [
                  { status: "placed" },
                  { status: "shipped" },
                  { status: "delivered" },
                  { status: "processing" }
                ]
              }
            ]

          }
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: '$totalPrice'
            }

          }
        }

      ]).toArray()

      if (total[0]) {
        resolve(total[0].total);
      } else {
        // console.log('total zero');
        resolve(0)
      }

    })
  },




  SalesReport: () => {
    return new Promise(async (resolve, reject) => {

      let data = await db.get().collection(collection.ORDER_COLLECTIONS).aggregate([

        {
          $match: {
            $and: [
              {
                $or: [
                  { status: "placed" },
                  { status: "shipped" },
                  { status: "delivered" },
                  { status: "processing" }
                ]
              }
            ]

          }
        },

        {

          $unwind: '$products'

        },
        {
          $project:
          {
            date: 1, totalPrice: 1, item: '$products.item', quantity: '$products.quantity'
          }
        },

        {
          $lookup:
          {
            from: collection.PRODUCT_COLLECTIONS,
            localField: 'item',
            foreignField: '_id',
            as: 'products'
          }
        },

        {
          $unwind: '$products'
        },

        {
          $project:
          {
            totalPrice: 1, date: 1, quantity: 1, product: '$products.Name', Price: '$products.Price'
          }
        },

        {
          $group: {
            _id: { date: '$date', product: '$product', price: '$Price', quantity: '$quantity' },


            total: { $sum: '$totalPrice' }
          }
        }
      ]).toArray()

      resolve(data)
    })
  },


  addUpdateAbout: (about, adminId) => {
    return new Promise((resolve, reject) => {
      const query = { admin: objectId(adminId) };
      const update = {
        $set: {

          about: about
        }
      };
      const options = { upsert: true };
      db.get().collection(collection.ABOUT_COLLECTION).updateOne(query, update, options).then(() => {
        resolve()
      })
    })
  },

  getAbout: () => {
    return new Promise((resolve, reject) => {
      db.get().collection(collection.ABOUT_COLLECTION).findOne().then((about) => {
        resolve(about)
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





















