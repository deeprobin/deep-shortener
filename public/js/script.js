$(document).ready(function(){

    $('#submit').click(function () {
        console.log("submit");
        setTimeout(function () {
          var text = $("#urlInput").val();
          generateShortenLink(text, function(url){
            if(url != "error") {
                console.log("url")
            $("#output").val("http://shrt.deeprobin.de/" + url);
            console.log("set value in output");
            } else {
                console.error("Shortener Error")
            }
          }); 
        }, 100);
      });

      $( "#urlInput" ).keypress(function() {
          console.log("changed input")
          var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;

          if(new RegExp(expression).test($(this).val())){
              $(this).removeClass("fail");
              $("#submit").prop("disabled", false)
              console.log("regex true")
          }else{
            $(this).addClass("fail");
            $("#submit").prop("disabled", true)
            console.log("regex wrong")
          }
      });

});


function generateShortenLink(longUrl, callback){
    $.get("/new/" + btoa(longUrl), function(data, status){
        if(data === "!!!error!!!") {
            callback("error")
        } else {
            callback(data);
        }
    });
}