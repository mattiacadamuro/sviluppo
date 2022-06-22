const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require("body-parser");
const { Sequelize, DataTypes } = require('sequelize');

//connection to the database
const sequelize = new Sequelize('testprodotti', 'root', '', {
    host: 'localhost',
    dialect: 'mariadb'
});

//prodotto definition
const prodotto = sequelize.define('prodotto', {
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false
    },
    prezzo: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'prodotto',
    timestamps: false
});

//app.use methods
app.use(bodyParser.urlencoded({ extended: false }));

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

//crea un prodotto con dei dati specifici
app.post("/create", function(req,res){
    const uName = req.headers['name']
    const uPrezzo = req.headers['prezzo']

    prodotto.create({nome: uName, prezzo: uPrezzo })

    res.send("element added")
})

//cancella un prodotto
app.delete('/:id', function(req, res){
    let id = req.params.id

    prodotto.destroy({
        where: {
            ID : id
        }
    })
    res.send("element canceled")
})

//restituisce tutto il db
app.get('/', async (req, res) => {
    console.log(await sequelize.query("SELECT MAX(ID) FROM prodotto"))
    const rows = await prodotto.findAll();
    res.send(rows)
})

app.get('/:id', async (req, res) => {
    const id = req.params.id

    const rows= await prodotto.findAll({
        where: {
            ID : id
        }
      })
    res.send(rows)
})

//edit specifico prodotto
app.put('/edit/:id', async(req, res) => {
    const id = req.params.id
    const nName = req.query.name
    const nPrezzo = req.query.prezzo

    await prodotto.update({ nome : nName, prezzo : nPrezzo}, {
        where: {
            id : id
        }
    })
    res.send("edited")
})

//cose che non so
var port = process.env.PORT || 3000;
app.listen(port, function() {
    console.log("Listening on " + port);
});