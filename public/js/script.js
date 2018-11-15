$(document).ready(function(){

    $('#submit').click(function () {
        console.log("submit");
        setTimeout(function () {
          var text = $("#urlInput").val();
          generateShortenLink(text, function(url){
            if(url != "error") {
                console.log("url")
            $("#output").val("http://shrt.deeprobin.de/" + url);
            var copyText = document.getElementById("output");
            copyText.select();
            document.execCommand("copy");
            showCopied();
            console.log("set value in output");
            } else {
                console.error("Shortener Error")
            }
          }); 
        }, 100);
      });

      $( "#urlInput" ).on("change keyup keypress paste", function() {
          console.log("changed input")
          //var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
          var expression = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;

          if(new RegExp(expression).test($(this).val() + "/")){
              $(this).removeClass("fail");
              $("#submit").prop("disabled", false)
              console.log("regex true")
          }else{
            $(this).addClass("fail");
            $("#submit").prop("disabled", true)
            console.log("regex wrong")
          }
      });

      $("#output").click(function() {
          copyToClipboard(document.getElementById("output"));
          showCopied();
      })

});

function showCopied() {
    var x = document.getElementById("snackbar");
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}


function generateShortenLink(longUrl, callback){
    $.get("/new/" + btoa(longUrl), function(data, status){
        if(data === "!!!error!!!") {
            callback("error")
        } else {
            callback(data);
        }
    });
}

function copyToClipboard(elem) {
    // create hidden text element, if it doesn't already exist
  var targetId = "_hiddenCopyText_";
  var isInput = elem.tagName === "INPUT" || elem.tagName === "TEXTAREA";
  var origSelectionStart, origSelectionEnd;
  if (isInput) {
      // can just use the original source element for the selection and copy
      target = elem;
      origSelectionStart = elem.selectionStart;
      origSelectionEnd = elem.selectionEnd;
  } else {
      // must use a temporary form element for the selection and copy
      target = document.getElementById(targetId);
      if (!target) {
          var target = document.createElement("textarea");
          target.style.position = "absolute";
          target.style.left = "-9999px";
          target.style.top = "0";
          target.id = targetId;
          document.body.appendChild(target);
      }
      target.textContent = elem.textContent;
  }
  // select the content
  var currentFocus = document.activeElement;
  target.focus();
  target.setSelectionRange(0, target.value.length);
  
  // copy the selection
  var succeed;
  try {
        succeed = document.execCommand("copy");
  } catch(e) {
      succeed = false;
  }
  // restore original focus
  if (currentFocus && typeof currentFocus.focus === "function") {
      currentFocus.focus();
  }
  
  if (isInput) {
      // restore prior selection
      elem.setSelectionRange(origSelectionStart, origSelectionEnd);
  } else {
      // clear temporary content
      target.textContent = "";
  }
  return succeed;
}