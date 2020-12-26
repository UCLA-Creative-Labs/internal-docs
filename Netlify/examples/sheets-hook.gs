function onEdit(e){
  if (!e) return;
  var sheet = e.range.getSheet();
  var name = sheet.getName();
  if (name === "Link") {
    post(map["tinycl"]);
  } else if (name === "Notifications"){
    post(map["sunshine"]);
  }
}

const map = {
  "tinycl": "https://api.netlify.com/build_hooks/5f9884537970be0bcf1792be",
  "sunshine": "https://api.netlify.com/build_hooks/5fbfe7da9ad37bc8ad257c13",
}

function post(url){
   try {
    var options = {
      "method": "post",
    }
    var response = UrlFetchApp.fetch(url, options);
    Logger.log(response);
  }
  catch (error) {
    Logger.log(error);
  }
}