//require
const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require("body-parser");

const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('testprodotti', 'root', '', {
    host: 'localhost',
    dialect: 'mariadb'
});

// prodotto definition
const prodotto = sequelize.define('prodotto', {
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false
    },
    prezzo: {
      type: DataTypes.INTEGER
      // allowNull defaults to true
    }
  }, {
    tableName: 'prodotto',
    timestamps: false
});

//app.use methods
app.use(bodyParser.urlencoded({ extended: false }));

/*
//database
let prodotti = [{
    "ID":1,
    "name" : "patate",
    "prezzo" : 20
},{
    "ID":2,
    "name" : "pere",
    "prezzo" : 30
}]

let nprodotti = 2 //ci sono già 2 prodotti del array
*/

//routes
app.get("/add", function(req, res) {
    res.sendFile(path.join(__dirname + '/add.html'));
});

app.get("/del", function(req, res) {
    res.sendFile(path.join(__dirname + '/delete.html'));
});

app.get("/mod", function(req, res) {
    res.sendFile(path.join(__dirname + '/mod.html'));
});

app.get("/main", function(req, res) {
    res.sendFile(path.join(__dirname + '/main.html'));
});

//non ha molto senso ma "ok"
app.get("/ok", function(req,res){
    res.sendStatus(200)
})

//popola l'array con altri 25 elementi nominati dalla A alla Z con costo casuale
app.get("/pop", function(req,res){
    for(let i = 0; i < 26; i++ ){
        let q = {
            "ID" : nprodotti + 1,
            "name" : String.fromCharCode(i + 65),
            "prezzo" : Math.floor(Math.random() * 51)
        }
        prodotti.push(q)
        nprodotti++ //incremento counter
    }
    res.send("array populated")
})

//crea un prodotto con dei dati specifici
app.post("/create", function(req,res){
    const uName = req.headers['name']
    const uPrezzo = req.headers['prezzo']

    prodotto.create({nome: "ananas", prezzo: "60" })

    let uprodotto = {
        "ID" : nprodotti + 1,
        "name" : uName,
        "prezzo" : uPrezzo
    }
    
    prodotti.push(uprodotto)
    nprodotti++ //incremento counter
    res.send("element added")
})

//cancella un prodotto
app.delete('/:id', function(req, res){
    let id = req.params.id
    
    if(id < prodotti.length){
        prodotti.splice(id,1)
        res.send("element canceled")
    }else
        res.send("ID not found");
})

//restituisce tutto l'array
app.get('/', async (req, res) => {
    const rows= await prodotto.findAll();
    res.send(rows)
})

//edit specifico prodotto
app.put('/edit/:id', (req, res) => {
    const id = req.params.id
    const nName = req.query.name
    const nPrezzo = req.query.prezzo

    if(id < prodotti.length){
        prodotti[id - 1] = {
            "ID" : parseInt(id),
            "name" : nName,
            "prezzo" : nPrezzo 
        }
        res.send("edited")
    }else
        res.send("ID not found")
})

//cose che non so
var port = process.env.PORT || 3000;
app.listen(port, function() {
    console.log("Listening on " + port);
});
