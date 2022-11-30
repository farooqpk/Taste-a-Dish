var express = require('express');
var router = express.Router();
var productHelpers=require('../helpers/product-helpers')
var adminHelpers=require('../helpers/admin-helpers')
var userHelpers=require('../helpers/user-helpers')

const verifyAdmin = (req, res, next) => {
  if (req.session.adminLoggedIn) {
    next();
  } else {
    res.redirect("/admin/Login");
  }
};




router.get('/', verifyAdmin,async(req, res)=> {
 let Admin=req.session.admin
let usersCount=await adminHelpers.getUserCount()
let ordersCount=await adminHelpers.getOrderCount()
let DishCount=await adminHelpers.getDishCount()
let CategoryCount=await adminHelpers.getCategoryCount()
 let salesCount=await adminHelpers.getSaleCount()
 let msgCount=await adminHelpers.getMsgCount()
 let codCount=await adminHelpers.getCodCount()
 let onlineCount=await adminHelpers.getOnlineCount()
  res.render('admin/admin-home',{admin:true,Admin,usersCount,ordersCount,DishCount,CategoryCount,salesCount,msgCount,codCount,onlineCount});
});



router.get('/add-product',verifyAdmin,async(req,res)=>{
  let category=await adminHelpers.allCategory()

  res.render('admin/add-product',{ admin:true,Admin:req.session.admin,category})

})


router.post('/add-product',verifyAdmin,(req,res)=>{
console.log(req.body);
 productHelpers.addProduct(req.body,(id)=>{
  let image=req.files.Image
  console.log(id);
  image.mv('./public/product-images/'+id+'.jpg',(err,done)=>{
    if(!err){
      res.redirect('/admin/')
    }else{
      console.log(err);
    }
  })
 })
})

router.get('/delete-product/:id',verifyAdmin,(req,res)=>{
let prodId=req.params.id
console.log(prodId);
productHelpers.deleteProduct(prodId).then((response)=>{
res.redirect('/admin/')
})
})

router.get('/edit-product/:id',verifyAdmin,async(req,res)=>{
 let product=await productHelpers.getProductDetails(req.params.id)
 let category=await adminHelpers.allCategory()
 res.render('admin/edit-product',{product,admin:true,Admin:req.session.admin,category})
})

router.post('/edit-product/:id',verifyAdmin,(req,res)=>{
 
   productHelpers.updateProduct(req.params.id, req.body).then(() => {
   
    res.redirect('/admin/all-products')
    if(req.files){
      let image = req.files.Image
      image.mv('./public/product-images/' + req.params.id + '.jpg',)
    }
  })
})


router.get('/all-Users',verifyAdmin,async(req,res)=>{
  let allUsers=await adminHelpers.allUserDetails()
  console.log(allUsers);
  res.render('admin/all-users',{admin:true,Admin:req.session.admin,allUsers})
  
})
router.get('/all-Orders',verifyAdmin,function(req,res){
  adminHelpers.viewOrderDetails().then((orderList)=>{
res.render('admin/all-orders',{orderList,admin:true,Admin:req.session.admin})
  })
})

router.get('/orderedProducts/:id',verifyAdmin,(req,res)=>{
 console.log(req.params.id);
 var orderId=req.params.id
 adminHelpers.getOrderedProducts(orderId).then((orderItems)=>{
     res.render('admin/order-products',{admin:true,orderItems,Admin:req.session.admin})
 })
})

router.post('/change-order-status/:id',verifyAdmin,(req,res)=>{
  console.log(req.params.id);
  console.log(req.body);
  adminHelpers.changeOrderStatus(req.params.id, req.body).then((response)=>{
  res.json({status:true})
  })
})

router.get('/Login',(req,res)=>{
  if (req.session.admin) {
    res.redirect("/admin/");
  } else{
    res.render("admin/Login", { "loginErr": req.session.adminLoginErr ,admin:true});
    req.session.adminLoginErr = false;
  } 
  
})

router.post('/Login',(req,res)=>{
  adminHelpers.dologin(req.body).then((response) => {
    if (response.status) {
      
      req.session.admin = response.admin;
      req.session.adminLoggedIn = true;
      res.redirect("/admin/");
    } else {
      req.session.adminLoginErr = "invalid username or password"
      res.redirect("/admin/Login");
    }
  });
})

router.get("/Logout", (req, res) => {
  req.session.admin=null
  req.session.adminLoggedIn=false
  res.redirect("/admin/");
  alert('poyi')
});


router.get('/add-category',verifyAdmin,(req,res)=>{
  res.render('admin/add-category',{admin:true,Admin:req.session.admin})
})

router.post('/add-category',verifyAdmin,(req,res)=>{
  
  productHelpers.addCategory(req.body).then((id)=>{
      
    let image=req.files.Image
    if(image){
      image.mv('./public/images/'+id+'.jpg',(err,done)=>{
        if(!err){
          res.redirect('/admin/')
        }else{
          console.log(err);
        }
      })
    }
  })
  })

  router.get('/all-category',verifyAdmin,async(req,res)=>{
    let category=await adminHelpers.allCategory()

    res.render('admin/all-categories',{admin:true,Admin:req.session.admin,category})
  })
  
router.get('/edit-category/:id',(req,res)=>{
  console.log(req.params.id);
   adminHelpers.specificCategory(req.params.id).then((category)=>{
    res.render('admin/edit-category',{admin:true,Admin:req.session.admin,category})
   })
})

router.post('/edit-category/:id',(req,res)=>{
   adminHelpers.editCategory(req.params.id,req.body.cat_name).then(()=>{
res.redirect('/admin/all-category')
if(req.files){
  let image = req.files.Image
  image.mv('./public/images/' + req.params.id + '.jpg',)
}
   })
})


router.get('/remove-category/:id',verifyAdmin,(req,res)=>{
  adminHelpers.removeCategory(req.params.id).then(()=>{
    res.redirect('/admin/all-category')
  })
})


router.post('/popular-dish/:id',(req,res)=>{
 
   productHelpers.popularDish(req.params.id,req.body.popular).then(()=>{
     res.json({status:true})
   })
})

router.get('/removeUser/:id',verifyAdmin,(req,res)=>{
  console.log(req.params.id);
   adminHelpers.removeUser(req.params.id).then(()=>{
    res.redirect('/admin/all-Users')
   })
})

router.get('/editUser/:id',verifyAdmin,async(req,res)=>{
  let user=await adminHelpers.getoneUser(req.params.id)
  res.render('admin/edit-user',{admin:true,Admin:req.session.admin,user})
})

router.post('/editUser/:id',async(req,res)=>{
  console.log(req.body);
   adminHelpers.editUser(req.params.id,req.body).then(()=>{    
     console.log(('edited'));
     res.redirect('/admin/all-Users')
 })
})

router.get('/all-products',verifyAdmin,(req,res)=>{
  productHelpers.getAllProducts().then((products)=>{
    res.render('admin/view-products',{admin:true,products,Admin:req.session.admin});
  
  })
})

router.get('/add-banner',verifyAdmin,(req,res)=>{
  res.render('admin/add-banner',{admin:true,Admin:req.session.admin})
})

router.post('/add-banner',(req,res)=>{
  adminHelpers.addbanner(req.body).then((id)=>{
    let image=req.files.Image
   if(image){
    image.mv('./public/banner-images/'+id+'.jpg',(err,done)=>{
      if(!err){
        res.redirect('/admin/')
      }else{
        console.log(err);
      }
    })
   }
  })
})


router.get('/all-banners',verifyAdmin,async(req,res)=>{
  let allBanner=await adminHelpers.getBanner()
  if(allBanner){
    res.render('admin/view-banners',{admin:true,Admin:req.session.admin,allBanner})
  }
})

router.get('/edit-banner/:id',verifyAdmin,async(req,res)=>{

  let banner= await adminHelpers.requiredBanner(req.params.id)
if(banner){
 
  res.render('admin/edit-banners',{admin:true,Admin:req.session.admin,banner})
}
})


router.post('/edit-banner/:id',(req,res)=>{
  console.log(req.body);
   adminHelpers.editBanner(req.params.id,req.body).then((id)=>{
res.redirect('/admin/all-banners')
if(req.files){
  let image = req.files.Image
  image.mv('./public/banner-images/' + id + '.jpg',)
}
   })
})

router.get('/remove-banner/:id',verifyAdmin,(req,res)=>{
  adminHelpers.removeBanner(req.params.id).then(()=>{
    res.redirect('/admin/all-banners')
  })
})

router.get('/removeOrder/:id',verifyAdmin,(req,res)=>{
 userHelpers.cancelOrder(req.params.id).then(()=>{
  res.redirect('/admin/all-Orders')
 })
})


router.post('/change-user-status/:id',(req,res)=>{
  adminHelpers.changeUserStatus(req.params.id,req.body.status).then(()=>{
    res.json({status:true})
  })
}
)

router.get('/admin-profile',verifyAdmin,async(req,res)=>{
  let adminProfile=await adminHelpers.getAdminData()
  res.render('admin/admin-profile',{admin:true,Admin:req.session.admin,adminProfile})
})

router.get('/edit-adminProfile',verifyAdmin,async(req,res)=>{
  let adminProfile=await adminHelpers.getAdminData()
  res.render('admin/edit-admin',{admin:true,Admin:req.session.admin,adminProfile})
})

router.post('/edit-adminProfile/:id',(req,res)=>{
adminHelpers.updateAdmin(req.body,req.params.id).then(()=>{
  res.redirect('/admin/admin-profile')
})
})

router.get('/edit-adminPass',verifyAdmin,(req,res)=>{
  res.render('admin/edit-adminPass',{admin:true,Admin:req.session.admin})
})


router.post('/edit-adminPass',(req,res)=>{
 adminHelpers.updateAdminPass(req.body,req.session.admin._id).then(()=>{
  res.redirect('/admin/')
 })
})

router.get('/all-messages',verifyAdmin,async(req,res)=>{
  let messages=await adminHelpers.getAllMessages()
  res.render('admin/all-messages',{admin:true,Admin:req.session.admin,messages})
})

router.get('/removeMsg/:id',(req,res)=>{
  adminHelpers.removeMsg(req.params.id).then(()=>{
    res.redirect('/admin/all-messages')
  })
})













module.exports = router;















