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
//try to use another page, where you define the schema and try to import it
const prodotto = sequelize.define('prodotto', {
    // Model attributes are defined here
    id: {
        // it is better to explicitate
       type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
      type: DataTypes.STRING, //See the documentation, because you can set the max dimension STRING(50)
      allowNull: false
    },
    prezzo: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'prodotto',
    timestamps: false // It is better to use the timestamp in db, because you can see when a certain entity is created or updated. Edit it
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
app.post("/create", async function(req,res){
    //Not use headers but use the body, so try with form in the html page
    const uName = req.headers['name']
    const uPrezzo = req.headers['prezzo']

    let product=await prodotto.create({nome: uName, prezzo: uPrezzo })

    res.send(product) //send back the product
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
    const id = Number(req.params.id) // better

    const rows= await prodotto.findAll({
        where: {
            ID : id
        }
      })
    res.send(rows)
})

//edit specifico prodotto
app.put('/edit/:id', async(req, res) => {
    //Use the body to pass the informations
    const id = req.params.id
    const nName = req.query.name
    const nPrezzo = req.query.prezzo
    
    
    
    //ok
    /*
    await prodotto.update({ nome : nName, prezzo : nPrezzo}, {
        where: {
            id : id
        }
    })
    */
    //You have to save the modification in db 
    
    
    //another way 
    let selectedproduct= await prodotto.findOne({where: { id : id}})
    if(selectedproduct===null)
        return res.send("not found")
    selectedproduct.set({ nome : nName, prezzo : nPrezzo})
    await selectedproduct.save(); //Important, otherwise you don't change the product status in db
    
    res.send(selectedproduct) //I send back the current product
})

//start application
var port = process.env.PORT || 3000;
app.listen(port, function() {
    console.log("Listening on " + port);
});
