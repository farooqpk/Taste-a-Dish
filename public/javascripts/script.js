

//wishlist add to cart separate function to avoid reloading in every add to cart
 function addWishCart(proId){
 
  $.ajax({
    url: "/add-to-cart/" + proId,
   method: "get",
   success: (response)=>{
      if(response.status){
        let count = $("#cart-count").html();
        count=parseInt(count)+1
        $("#cart-count").html(count)
      location.href='/cart'
    
     }
    }
  })
}


 function addToCart(proId){
 
   $.ajax({
     url: "/add-to-cart/" + proId,
    method: "get",
    success: (response)=>{
       if(response.status){
         let count = $("#cart-count").html();
         count=parseInt(count)+1
         $("#cart-count").html(count)
       
     
      }
     }
   })
 }

 function checkUser(){
   $.ajax({
     url: "/add-check" ,
     method: "get",
     success: (response) => {
       if (response.status) {
         location.href= '/login'
                           
       }
     }
   })
 }





function changeQuantity(cartId,proId,userId,count){
  let quantity=parseInt(document.getElementById(proId).innerHTML)
  count=parseInt(count)
  $.ajax({
    url:"/change-product-quantity",
    data:{
      user:userId,
      cart:cartId,
      product:proId,
      count:count,
      quantity:quantity
    },
    method:"post",
    success:(response)=>{
      if (response.removeProduct) {
        
        location.reload()    
       
      }else{
        document.getElementById(proId).innerHTML=quantity+count
        document.getElementById('total').innerHTML=response.total
        
      }
    }
   
  })
}


function removeCart(cartId,proId,proName){
  if(confirm('are you sure to remove '+proName+'?')==true){
  $.ajax({ 
    url:"/remove-cart",
    data:{
      cart:cartId,
      product:proId
    },
    method:"post",
    success:(response)=>{
     if(response.status==true){
      location.reload()
     }
      
    }
  })
}else{
  return false
}
}




function addWishlist(proId){
  $.ajax({
    url:"/add-wishList/"+proId,
    method:"get",
   success:(response)=>{
    if(response.status){
      let count = $("#wish-count").html();
      count=parseInt(count)+1
      $("#wish-count").html(count)
    }
   }
  })
}

function removeWish(wishId,proId){
  $.ajax({
    url:'/remove-wish',
    method:'post',
    data:{
      wish:wishId,
      product:proId
    },
    success:(response)=>{
      if(response.status){
        location.reload()
      }
    }
  })
}