 let navbar = document.querySelector('.header .flex .navbar');
 let profile = document.querySelector('.header .flex .profile');

 document.querySelector('#menu-btn').onclick = () =>{
    navbar.classList.toggle('active');
   profile.classList.remove('active');
 }

 document.querySelector('#user-btn').onclick = () =>{
    profile.classList.toggle('active');
    navbar.classList.remove('active');
 }

 window.onscroll = () =>{
    profile.classList.remove('active');
    navbar.classList.remove('active');
 }


//  function loader(){
//    document.querySelector('.loader-container').classList.add('fade-out');
//  }
 
//  function fadeOut(){
//    setInterval(loader, 100);
//  }
 
//  window.onload = fadeOut;