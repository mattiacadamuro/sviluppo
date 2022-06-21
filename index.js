//require
const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require("body-parser");

//app.use methods
app.use(bodyParser.urlencoded({ extended: false }));

//indenta giusto
let prodotti = [{
    "ID":1,
    "name" : "patate",
    "prezzo" : 20
},{
    "ID":2,
    "name" : "pere",
    "prezzo" : 30
}
]



//routes
app.get("/add", function(req, res) {
    res.sendFile(path.join(__dirname + '/add.html'));
});

app.get("/del", function(req, res) {
    res.sendFile(path.join(__dirname + '/delete.html'));
});

app.get("/ok", function(req,res){
    res.sendStatus(200)
})

app.get("/pop", function(req,res){
    for(let i = 0; i < 26; i++ ){
        let q = {
            "name" : String.fromCharCode(i + 65),
            "prezzo" : Math.floor(Math.random() * 51)
        }
        prodotti.push(q)
    }
    res.send("array popolato")
})

app.post("/create", function(req,res){
    const uName = req.headers['name'] // No header but use the body. See the documentation
    const uPrezzo = req.headers['prezzo']
    
    let prodotto = {
        "name" : uName,
        "prezzo" : uPrezzo
    }
    //create new product with new ID, increment every time the ID
    prodotti.push(prodotto)
    res.send("elemento aggiunto")
})

app.delete('/:id', function(req, res){
    const id = req.query.id  // try to use :id (params) instead of query
    
    if(id < prodotti.length){
        prodotti.splice(id,1)
        res.send("element canceled")
    }else
        res.send("ID not found");
})

app.get('/', (req, res) => {
    res.send(prodotti)
})

app.put('/edit/:id', (req, res) => {
    const id = req.params.id
    const nName = req.query.name
    const nPrezzo = req.query.prezzo
    
    if(id < prodotti.length){
        prodotti[id] = {
            "name" : nName,
            "prezzo" : nPrezzo 
        }
        res.send("edit effettuato")
    }else
        res.send("id non esistente")
})

var port = process.env.PORT || 3000;
app.listen(port, function() {
    console.log("Listening on " + port);
});
