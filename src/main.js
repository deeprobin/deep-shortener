const  fs = require('fs');
const path = require('path');

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('data/db.json')
const db = low(adapter)

db.defaults({urls: {}})
  .write()

// Add a post
db.get('urls')
  .push({ /*id: 1, url: 'https://google.de'*/})
  .write()

const express = require('express')
const app = express()
const port = process.env.PORT || 3000

app.set('views', path.join(__dirname, '../views/'));
app.set('view engine', 'pug');
app.get('/', function (req, res) {
    res.render('index')
})

app.get("/css/style.css", function(req, res){
    res.set({
        'Content-Type': 'text/css'
    });
    fs.readFile(path.join(__dirname,'../public/css/style.css'),function(err, data){
        res.send(data);
    });
});

app.all("/undefined", function(req, res){
    res.writeHead(200);
    res.send();
})

app.all("/favicon.ico", function(req, res){
    res.set({
        'Content-Type': 'image/x-icon'
    });
    fs.readFile(path.join(__dirname,'../public/img/favicon.ico'),function(err, data){
        res.send(data);
    });
})

app.get("/js/script.js", function(req, res){
    res.set({
        'Content-Type': 'application/javascript'
    });
    fs.readFile(path.join(__dirname, '../public/js/script.js'),function(err, data){
        res.send(data);
    });
});

app.get("/new/:url", function(req, res){
    var url = Buffer.from(req.params.url, 'base64').toString("utf-8");
    try {
    var id = generateRandomId();
    db.set(id, url).write()
    res.send(id);
    console.log(req.ip + " created short url(" + id + ") with url " + url);
    } catch(ex){
        res.send("!!!error!!!")
        console.error("Errored: " + ex)
    }
});

/*
app.get("/img/robin-logo.svg", function(req, res){
    res.set({
        'Content-Type': 'image/svg+xml'
    });
    fs.readFile(path.join(__dirname,'../static/img/robin-logo.svg'),function(err, data){
        res.send(data);
    });
});*/




app.get("/:id", function(req, res){
    console.log(req.ip + " trys to load site with key: " + req.params.id)
    var url = db.get(req.params.id);
    if(url){
        res.writeHead(301,
            {Location: url}
          );
          res.send();
    } else res.status(404);
});

app.listen(port, () => console.log(`URL shortener app listening on port ${port}!`))

function generateRandomId(){
    var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}