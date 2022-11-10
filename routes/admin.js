var express = require('express');
var router = express.Router();
var productHelpers=require('../helpers/product-helpers')
var adminHelpers=require('../helpers/admin-helpers')
var categoryHelpers=require('../helpers/category-helpers')


const verifyAdmin = (req, res, next) => {
  if (req.session.adminLoggedIn) {
    next();
  } else {
    res.redirect("/admin/Login");
  }
};



/* GET users listing. */
router.get('/', verifyAdmin,function(req, res) {
  let Admin=req.session.admin
productHelpers.getAllProducts().then((products)=>{
  res.render('admin/view-products',{admin:true,products,Admin});

})
});



router.get('/add-product',verifyAdmin,function(req,res){
  res.render('admin/add-product',{admin:true})

})


router.post('/add-product',verifyAdmin,(req,res)=>{
/// console.log(req.body);
 ///console.log(req.files.Image);
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

router.get('/delete-product/:id',(req,res)=>{
let prodId=req.params.id
console.log(prodId);
productHelpers.deleteProduct(prodId).then((response)=>{
res.redirect('/admin/')
})
})

router.get('/edit-product/:id',verifyAdmin,async(req,res)=>{
 let product=await productHelpers.getProductDetails(req.params.id)
 console.log(product);
 res.render('admin/edit-product',{product,admin:true})
})

router.post('/edit-product/:id',(req,res)=>{
 
  let image = './public/product-images/' + req.params.id + '.jpg'
   productHelpers.updateProduct(req.params.id, req.body).then(() => {
    res.redirect('/admin/')
    image = req.files.Image
    if (image) {
      image.mv('./public/product-images/' + req.params.id + '.jpg',)
    } else {
      res.redirect('/admin/')
    }
  })
})


router.get('/all-Users',verifyAdmin,(req,res)=>{
  console.log('ready');
  res.render('admin/all-users',{admin:true})
  
})
router.get('/all-Orders',verifyAdmin,function(req,res){
  adminHelpers.viewOrderDetails().then((orderList)=>{
res.render('admin/all-orders',{orderList,admin:true})
  })
})

router.get('/orderedProducts/:id',(req,res)=>{
 console.log(req.params.id);
 var orderId=req.params.id
 adminHelpers.getOrderedProducts(orderId).then((orderItems)=>{
     res.render('admin/order-products',{admin:true,orderItems})
 })
})

router.post('/change-order-status/:id',(req,res)=>{
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


router.get('/add-category',(req,res)=>{
  res.render('admin/add-category',{admin:true})
})

router.post('/add-category',(req,res)=>{
  
  categoryHelpers.addCategory(req.body).then((id)=>{
      
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

  

  





module.exports = router;















