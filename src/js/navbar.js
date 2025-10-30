window.onscroll = function(){scrollFunction()};


function scrollFunction() {

    const scrolledPixels = window.scrollY;
  
    if (document.body.scrollTop > 25 || document.documentElement.scrollTop > 25) {
    document.getElementById("navbar").style.top = "0px";
    } else {
    document.getElementById("navbar").style.top = (25 - scrolledPixels) + "px";

    }
}




