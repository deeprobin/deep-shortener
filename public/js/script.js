window.addEventListener("load", function(){
  window.cookieconsent.initialise({
    "palette": {
      "popup": {
        "background": "#8f820b"
      },
      "button": {
        "background": "#f1d600",
        "text": "#000000"
      }
    },
    "theme": "edgeless",
    "position": "bottom-right",
    "content": {
      "message": "This website uses cookies to ensure you get the best experience on our website. ",
      "dismiss": "O.K.",
      "link": "See cookie policy"
    }
  })});

$(document).ready(function() {
  $("#submit").click(function() {
    console.log("submit");
    setTimeout(function() {
      var text = $("#urlInput").val();
      generateShortenLink(text, function(url) {
        if (url != "error") {
          console.log("url");
          $("#output").val("https://shrt.deeprobin.de/" + url);
        } else {
          console.error("Shortener Error");
        }
      });
    }, 100);
  });

  $("#urlInput").on("change keyup keypress paste", function() {
    console.log("changed input");
    var expression = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;

    if (new RegExp(expression).test($(this).val() + "/")) {
      $(this).removeClass("fail");
      $("#submit").prop("disabled", false);
    } else {
      $(this).addClass("fail");
      $("#submit").prop("disabled", true);
    }
  });

  $("#output").click(function() {
    if ($("#output").val() != "") {
      copyToClipboard(document.getElementById("output"));
      showCopied();
    }
  });
});

function showCopied() {
  var x = document.getElementById("snackbar");
  x.className = "show";
  setTimeout(function() {
    x.className = x.className.replace("show", "");
  }, 3000);
}

function generateShortenLink(longUrl, callback) {
  $.get("/new/" + btoa(longUrl), function(data, status) {
    if (data === "!!!error!!!") {
      callback("error");
    } else {
      callback(data);
    }
  });
}

function copyToClipboard(elem) {
  var targetId = "_hiddenCopyText_";
  var isInput = elem.tagName === "INPUT" || elem.tagName === "TEXTAREA";
  var origSelectionStart, origSelectionEnd;
  if (isInput) {
    target = elem;
    origSelectionStart = elem.selectionStart;
    origSelectionEnd = elem.selectionEnd;
  } else {
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
  var currentFocus = document.activeElement;
  target.focus();
  target.setSelectionRange(0, target.value.length);

  var succeed;
  try {
    succeed = document.execCommand("copy");
  } catch (e) {
    succeed = false;
  }
  if (currentFocus && typeof currentFocus.focus === "function") {
    currentFocus.focus();
  }

  if (isInput) {
    elem.setSelectionRange(origSelectionStart, origSelectionEnd);
  } else {
    target.textContent = "";
  }
  return succeed;
}
