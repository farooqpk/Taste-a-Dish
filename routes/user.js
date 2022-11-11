var express = require("express");
const { Db } = require("mongodb");

const { response } = require("../app");
const { CART_COLLECTIONS } = require("../config/collections");
const categoryHelpers = require("../helpers/category-helpers");
var router = express.Router();
var productHelpers = require("../helpers/product-helpers");
const userHelpers = require("../helpers/user-helpers");



const verifyLogin = async(req, res, next) => {
  if (req.session.userLoggedIn) {
    next();
  } else {
    res.redirect("/login");
  }
};


/* GET home page. */
router.get("/", async function (req, res, next) {
  let User = req.session.user;
  console.log(User);
  let cartCount = null;
  let wishCount=null
  
  if (User) {
    cartCount = await userHelpers.getCartCount(User._id);
    wishCount = await userHelpers.getWishCount(User._id);
  }
   let category=await categoryHelpers.getAllCategory()
  
  res.render("./user/home", { User, cartCount,category,wishCount});
 
  
 
});



router.get('/products/:id', async (req, res) => {
  console.log(req.params.id);
 
  let cartCount=null
  let wishCount=null
  if (req.session.user) {
    cartCount = await userHelpers.getCartCount(req.session.user._id)
    wishCount = await userHelpers.getWishCount(req.session.user._id);
   }
  let products = await userHelpers.getRequiredProducts(req.params.id)
  
  res.render('user/products', {products, User: req.session.user,cartCount,wishCount})
})



router.get("/login", (req, res) => {
  if (req.session.user) {
   
    res.redirect("/");
  } else{
    res.render("user/login", { "loginErr": req.session.userLoginErr });
    
    req.session.userLoginErr = false;
  } 
});

router.get("/signup", (req, res) => {
  res.render("user/signup");
});
router.post("/signup", (req, res) => {
  userHelpers.doSignup(req.body).then((response) => {
    
    req.session.user = response;
    req.session.userLoggedIn = true;
    res.redirect("/");
  });
});

router.post("/login", (req, res) => {
  userHelpers.doLogin(req.body).then((response) => {
    if (response.status) {
      
      req.session.user = response.user;
      req.session.userLoggedIn = true;

      res.redirect("/");
    } else {
      req.session.userLoginErr = "invalid username or password";
      res.redirect("/login");
    }
  });
});
router.get("/logout", (req, res) => {
  req.session.user=null
  req.session.userLoggedIn=false
  res.redirect("/");
});

router.get("/cart", verifyLogin, async (req, res) => {
  let wishCount=null
  if (req.session.user) {
    wishCount = await userHelpers.getWishCount(req.session.user._id);
  }
  let products = await userHelpers.getCartProducts(req.session.user._id);
  let total = await userHelpers.getTotalAmount(req.session.user._id);

  res.render("user/cart", { products, User: req.session.user, total,wishCount });
});


//to verify  when addtocart without login
 router.get("/add-check",(req,res,next)=>{
   if(req.session.userLoggedIn){
        res.json({status:false})
   }else{
    res.json({status:true})
   }
 })




router.get("/add-to-cart/:id", (req, res) => {
 console.log( req.session.user);
  userHelpers.addToCart(req.params.id, req.session.user._id).then(() => {
    res.json({ status: true });
  });
  
});

router.post("/change-product-quantity",(req, res, next) => {
  console.log(req.body);
  userHelpers.changeProductQuantity(req.body).then( async(response) => {
    response.total = await userHelpers.getTotalAmount(req.body.user);

    res.json(response);
  });
});

router.post("/remove-cart", (req, res, next) => {
  userHelpers.removeCart(req.body).then(() => {
    res.json({status:true});
  });
});

router.get("/place-order", verifyLogin, async (req, res) => {
  let total = await userHelpers.getTotalAmount(req.session.user._id);
  let cartItems=await userHelpers.getCartProducts(req.session.user._id)
  let userProfile=await userHelpers.getUserProfile(req.session.user._id)
 
  res.render("user/placeOrder", { User: req.session.user, total,cartItems ,userProfile});
});


router.post("/place-order", async (req, res) => {
   console.log(req.body);
   let products = await userHelpers.getCartProductList(req.body.userId);
   let totalPrice = await userHelpers.getTotalAmount(req.body.userId);
   userHelpers.placeOrder(req.body, products, totalPrice).then((orderId) => {
    console.log('useril ethy');
     if (req.body["payment-method"] === "COD") {
       res.json({successCOD:true });
     } else {
      userHelpers.generateRazorpay(orderId, totalPrice).then((response) => {
         res.json(response);
      });
     }
   });
});

router.get("/success", (req,res) => {
  res.render("user/success", { User: req.session.user });
});

router.get("/view-order", verifyLogin, async (req, res) => {
  let orders = await userHelpers.viewOrderDetails(req.session.user._id);
  res.render("user/order", { User:req.session.user,orders });
});

router.get("/ordered-product/:id", verifyLogin, async (req, res) => {
  let orderProduct = await userHelpers.orderedProduct(req.params.id);
  console.log(orderProduct);
  res.render("user/ordered-Product", { orderProduct, User: req.session.user });
});

router.post("/verify-payment", (req, res) => {
  console.log(req.body);
  userHelpers
    .verifyPayment(req.body)
    .then(() => {
      userHelpers.changePaymentStatus(req.body["order[receipt]"]).then(() => {
        res.json({ status: true });
      });
    })
    .catch((err) => {
      res.json({ status: false });
    });
});

router.get('/all-products',async(req,res)=>{
 
  let cartCount=null
  let wishCount=null
  var allProducts=await productHelpers.getAllProducts()
  if (req.session.user) {
    cartCount = await userHelpers.getCartCount(req.session.user._id)
      wishCount = await userHelpers.getWishCount(req.session.user._id);
   }
res.render('user/all-products',{cartCount,allProducts, User: req.session.user,wishCount})

})

router.get('/profile',verifyLogin,async(req,res)=>{
  let userProfile=await userHelpers.getUserProfile(req.session.user._id)
  res.render('user/profile',{User: req.session.user,userProfile})
})

router.get('/update-profile',verifyLogin,async(req,res)=>{
  let userProfile=await userHelpers.getUserProfile(req.session.user._id)
  res.render('user/update_profile',{userProfile,User: req.session.user})
})

router.post('/update-profile',verifyLogin,(req,res)=>{
  console.log(req.body);
  userHelpers.updateProfile(req.body,req.session.user._id).then(()=>{
    res.redirect('/profile')
    alert('update succesfully')
  }).catch(()=>{
    res.render('/error')
  })
})

router.get('/update-password',verifyLogin,(req,res)=>{
  res.render('user/update_password')
})

router.post('/update-password',(req,res)=>{
  userHelpers.updatePassword(req.body,req.session.user._id).then(()=>{
    res.redirect('/profile')
  }).catch((err)=>{
        console.log(err);
  })
})

router.post('/contact-us',(req,res)=>{
  console.log(req.body);
  userHelpers.userMessage(req.body).then(()=>{
    res.json({status:true})
  })
})

router.get('/wishList',async(req,res)=>{
  let products=null
  let cartCount=null

  if (req.session.user) {
     products = await userHelpers.getWishProducts(req.session.user._id);
    cartCount = await userHelpers.getCartCount(req.session.user._id)

  }
    res.render('user/wishlist',{products,User:req.session.user,cartCount})
  
})

router.get('/add-wishList/:id',(req,res)=>{
   userHelpers.addWishList(req.params.id, req.session.user._id).then(()=>{
   res.json({status:true})
   })
})


router.post('/remove-wish',(req,res)=>{
  console.log(req.body);
  userHelpers.removeWish(req.body).then(()=>{
    res.json({status:true})
  })
})








module.exports = router;
