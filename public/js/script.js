window.addEventListener("load", function() {
  window.cookieconsent.initialise({
    palette: {
      popup: {
        background: "#8f820b"
      },
      button: {
        background: "#f1d600",
        text: "#000000"
      }
    },
    theme: "edgeless",
    position: "bottom-right",
    content: {
      message:
        "This website uses cookies to ensure you get the best experience on our website. ",
      dismiss: "O.K.",
      link: "See cookie policy"
    }
  });
});

function ready(fn) {
  if (
    document.attachEvent
      ? document.readyState === "complete"
      : document.readyState !== "loading"
  ) {
    fn();
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
}

ready(function() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/js/sw.js").then(function() {
      console.log("Service Worker Registered");
    });
  }
  
  (adsbygoogle = window.adsbygoogle || []).push({});

  document.getElementById("submit").onclick = function() {
    setTimeout(function() {
      var text = document.getElementById("urlInput").value;
      generateShortenLink(text, function(url) {
        if (url != "error") {
          document.getElementById("output").value =
            "https://" +
            window.location.hostname.replace("www.", "") +
            "/" +
            url;
        } else {
          console.error("Shortener Error");
        }
      });
    }, 100);
  };
  document.getElementById("output").onclick = function() {
    if (document.getElementById("output").value != "") {
      copyToClipboard(document.getElementById("output"));
      showCopied();
    }
  };

  document.getElementById("urlInput").onchange = function(event) {
    onUrlInputChange(event);
  };
  document.getElementById("urlInput").onkeypress = function(event) {
    onUrlInputChange(event);
  };
  document.getElementById("urlInput").onkeyup = function(event) {
    onUrlInputChange(event);
  };
  document.getElementById("urlInput").onpaste = function(event) {
    onUrlInputChange(event);
  };
});

function onUrlInputChange(event) {
  var expression = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;
  u = document.getElementById("urlInput").value;

  if (!u.match(/^[a-zA-Z]+:\/\//)) {
    u = "http://" + u;
  }

  if (new RegExp(expression).test(u + "/")) {
    document.getElementById("urlInput").className = "";
    document.getElementById("submit").disabled = false;
  } else {
    document.getElementById("urlInput").className = "fail";
    document.getElementById("submit").disabled = true;
  }
}

function showCopied() {
  var x = document.getElementById("snackbar");
  x.className = "show";
  setTimeout(function() {
    x.className = x.className.replace("show", "");
  }, 3000);
}

function generateShortenLink(longUrl, callback) {
  var request = new XMLHttpRequest();
  request.open("GET", "/new/" + btoa(longUrl), true);

  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      var data = request.responseText;
      if (data === "!!!error!!!") {
        callback("error");
      } else {
        callback(data);
      }
    } else {
      console.error("XHR errored");
      callback("error");
    }
  };

  request.onerror = function() {
    console.log("connection error");
    callback("error");
  };

  request.send();
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
