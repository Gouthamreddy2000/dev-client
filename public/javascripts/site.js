/*var onSignIn = function(loggedIn){
    if(loggedIn){
        console.log("Logged In");
        $("#signedIn").show();
        $("#notSignedIn").hide();
       // $("#welcomeUser").html("Welcome "+ userObject.getCurrentUser());
    }
    else{
        console.log("Not Logged In");
        $("#notSignedIn").show();
        $("#signedIn").hide();
    }
}*/

$("#slide").hide();
$("#profileb").hide();
$("#mailb").hide();
$("#signedInchat").hide();
$("#notSignedIn").show();
$("#signedIn").hide();
$("#lnkSignout").on('click',function(){
    $.post( "/api/logout")
    .done(function( data ) {
        //signOut();
        //console.log("signed out");
        //onSignIn(false);
        if(data.success==false){
            $("#notSignedIn").show();
            $("#signedIn").hide();
            $("#signedInchat").hide();
            $("#mailb").hide();
            $("#profileb").hide();
            $("#slide").hide();
            signOut();
        }
    })
    .fail(function() {
        //alert( "error" );
    })
    .always(function() {
        //alert( "finished" );
    });
})
function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
  }
$("#search").on('click',function(e){
    e.preventDefault();
    e.stopPropagation();
    var user=$("#input-search").val();
    console.log("hi");
    $.get( "/api/search"+user)
    .done(function( data ) {
        //console.log("enter");
        //signOut();
        //console.log("signed out");
        //onSignIn(false);
        if(data.success==true){
            toastr.success( 'User Found');
        console.log(JSON.stringify(data.user.username));
        $("#name").html(JSON.stringify(data.user.username));
        }
        else{
            toastr.error( 'User Not Found');
        }
    })
    .fail(function() {
        //toastr.error( 'User Not Found');
        //alert( "error" );
    })
    .always(function() {
        //toastr.error( 'User Not Found');
        //alert( "finished" );
    });
  })
function onSignIn(googleUser) {
    //console.log("signin");
    var id_token = googleUser.getAuthResponse().id_token;
    var xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/loggedin');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = function() {
            //console.log(payload);
        console.log('Signed in as: ' + xhr.responseText);
        //console.log(xhr.responseText.given_name);
        if(xhr.responseText=='success'){
            //signOut();
            //getPayload();
            //$("#notSignedIn").show();
            $("#signedIn").show();
        $("#notSignedIn").hide();
        $("#lnkLogout").hide();
        $("#lnkSignout").show();
        $("#signedInchat").show();
        $("#mailb").show();
        $("#profileb").show();
        $("#slide").show();
            //onSignIn(true);
        }
        };
        xhr.send(JSON.stringify({token: id_token}));
}
$(document).ready(function(){ 
    var onSignIn = function(loggedIn){
        if(loggedIn){
            console.log("Logged In");
            $("#signedIn").show();
            $("#notSignedIn").hide();
            $("#mailb").show();
            $("#signedInchat").show();
            $("#profileb").show();
            $("#slide").show();
           // $("#welcomeUser").html("Welcome "+ userObject.getCurrentUser());
        }
        else{
            console.log("Not Logged In");
            $("#notSignedIn").show();
            $("#signedIn").hide();
            $("#signedInchat").hide();
            $("#mailb").hide();
            $("#profileb").hide();
            $("#slide").hide();
        }
    }
    var userObject = {
        saveUserInLocalStorage : function(userJson){
            window.localStorage.setItem('currentUser', JSON.stringify(userJson));
        },
        removeCurrentUser: function(){
            window.localStorage.removeItem('currentUser');
        },
        getCurrentUser : function(){
            return window.localStorage.getItem('currentUser');
        },
        getCurrentUserName : function(){
            var curUserString = this.getCurrentUser();
            if(curUserString){
                var json = JSON.parse(curUserString);
                if(json && json.username)
                    return json.username;
                return "";
            }
            return "";
        },
        isUserLoggedIn : function(){
            if(this.getCurrentUser()==null)
                return false;
            return true;
        }
    };

    console.log("jquery running");
$("#notSignedIn").show();
$("#signedIn").hide();
$("#lnkLogout").click(function(e){
    e.preventDefault();
    e.stopPropagation(); 
    $.post( "/api/loggedout")
    .done(function( data ) {

        //console.log(JSON.stringify(data));
        console.log("signed out");
        onSignIn(false);
        if(data.success){
            userObject.removeCurrentUser();
        }
    })
    .fail(function() {
        //alert( "error" );
    })
    .always(function() {
        //alert( "finished" );
    });

})
$("#btnLogIn").on('click', function(e){
    e.preventDefault();
    e.stopPropagation(); 
    $("#lnkLogout").show();
    $("#lnkSignout").hide();
    var userObj = {username: '', password:''};
    userObj.username = $("#Username").val();
    userObj.password = $("#Password").val();
    console.log(userObj);
    $.post( "/api/login", userObj)
    .done(function( data ) {
        var datapro=data;
        //console.log(datapro);
        //console.log(JSON.stringify(data));
        
        if(data.success){
            toastr.success(data.message, 'Successful');
            $("#welcomeUser").html("Welcome "+ JSON.stringify(data.user.username));
            userObject.saveUserInLocalStorage(data.user);
            onSignIn(true);
        }
        else{
            toastr.error(data.message, 'Failed');
        }
    })
    .fail(function() {
        //alert( "error" );
    })
    .always(function() {
        //alert( "finished" );
    });
})
})
//console.log(datapro);
$("#profile").on('click',function(){
    $("#username").html( JSON.stringify(datapro.user.username));
    $("#date").html( JSON.stringify(datapro.user.date));
    $("#email").html(JSON.stringify(datapro.user.email));
    $("#phonenumber").html(JSON.stringify(datapro.user.phonenumber));
})

var slideIndex = 0;
showSlides();

function showSlides() {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("dot");
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";  
  }
  slideIndex++;
  if (slideIndex > slides.length) {slideIndex = 1}    
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";  
  dots[slideIndex-1].className += " active";
  setTimeout(showSlides, 2000); // Change image every 2 seconds
}