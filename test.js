const express = require('express')
const app = express()
const path = require('path')
const { Sequelize, DataTypes } = require('sequelize');

app.use(express.json({ extended: false }));

const sequelize = new Sequelize('prova sito', 'root', '', {
    host: 'localhost',
    dialect: 'mariadb'
});

const sicurezza = sequelize.define('sicurezza', {
    ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    DATA: {
        type: DataTypes.DATE,
        allowNull: false
    },
    DITTA: {
        type: DataTypes.STRING,
        allowNull: false
    },
    SEDE_OPERATIVA: {
        type: DataTypes.STRING,
        allowNull: false
    },
    N_SOCI: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    N_SOCI_LAVORATORI: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    N_DIPENDENTI: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    INTERFERENZE: {
        type: DataTypes.STRING,
        allowNull: false
    },
    DESCRIZIONE_ATTIVITA: {
        type: DataTypes.STRING,
        allowNull: false
    },
    N_ORE_SETTIMANALI: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    DATORE_LAVORO: {
        type: DataTypes.STRING,
        allowNull: false
    },
    VALUE: {
        type: DataTypes.JSON,
        allowNull: false
    }
}, {
    tableName: 'sicurezza',
    timestamps: false
});

app.post("/checklist", function (req, res) {
    const dati = req.body.dati
    const datiJSON = JSON.stringify(req.body.datiJSON)

    sicurezza.create({
        DATA : dati.DATA,
        DITTA : dati.DITTA,
        SEDE_OPERATIVA :dati.SEDE_OPERATIVA,
        N_SOCI : dati.N_SOCI,
        N_SOCI_LAVORATORI : dati.N_SOCI_LAVORATORI,
        N_DIPENDENTI : dati.N_DIPENDENTI,
        INTERFERENZE : dati.INTERFERENZE,
        DESCRIZIONE_ATTIVITA :dati.DESCRIZIONE_ATTIVITA,
        N_ORE_SETTIMANALI : dati.N_ORE_SETTIMANALI,
        DATORE_LAVORO : dati.DATORE_LAVORO,
        VALUE : datiJSON
    })

    res.send("element added")
})

app.get('/checklist/:id', async (req, res) => {
    const id = req.params.id

    const rows = await sicurezza.findAll({
        where: {
            ID: id
        }
    })
    res.send(rows)
})

app.put('/checklist/:id', async (req, res) => {
    const id = req.params.id
    const dati = req.body.dati
    const datiJSON = JSON.stringify(req.body.datiJSON)

    await sicurezza.update({ 
        DATA : dati.DATA,
        DITTA : dati.DITTA,
        SEDE_OPERATIVA :dati.SEDE_OPERATIVA,
        N_SOCI : dati.N_SOCI,
        N_SOCI_LAVORATORI : dati.N_SOCI_LAVORATORI,
        N_DIPENDENTI : dati.N_DIPENDENTI,
        INTERFERENZE : dati.INTERFERENZE,
        DESCRIZIONE_ATTIVITA :dati.DESCRIZIONE_ATTIVITA,
        N_ORE_SETTIMANALI : dati.N_ORE_SETTIMANALI,
        DATORE_LAVORO : dati.DATORE_LAVORO,
        VALUE : datiJSON
    }, {
        where: {
            ID: id
        }
    })
    res.send("edited")
})

var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log("Listening on " + port);
});