

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
         swal("Item Added To Cart", "", "success");
     
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
  
  if(cartId && proId && proName){
    if(confirm('are you sure to remove '+proName+'?')==true){
      $.ajax({ 
        url:"/remove-cart",
        data:{
          cart:cartId,
          product:proId
        },
        method:"delete",
        success:(response)=>{
         if(response.status==true){
          location.reload()
         }
          
        }
      })
    }else{
      return false
    }
  } else{
    $.ajax({ 
      url:"/remove-cart-noProduct",
      data:{
        cart:cartId,
       
      },
      method:"delete",
      success:(response)=>{
       if(response.status==true){
        location.reload()
       }
        
      }
    })
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
      swal("Item Added To Wishlist", "", "success");
    }
   }
  })
}

function removeWish(wishId,proId){
  
  if(wishId && proId){
    $.ajax({
      url:'/remove-wish',
      method:'delete',
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
  }else{
    $.ajax({
      url:'/remove-wish-noProduct',
      method:'delete',
      data:{
        wish:wishId
       
      },
      success:(response)=>{
        if(response.status){
          location.reload()
        }
      }
    })
  }
  
}


function cancelOrder(orderId){
  if(confirm('are you sure to remove ?')==true){
    $.ajax({
      url:'/cancel-order',
      method:'delete',
      data:{id:orderId},
      success:(response)=>{
        
      
      swal("Removed", "", "success");
      setInterval(()=>{
       location.reload()
      },3000)

      
      }
    })
  }else{
    return false
  }
 
}