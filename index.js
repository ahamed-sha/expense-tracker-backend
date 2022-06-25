// do npm install as first step
const express = require("express");
var bodyParser = require("body-parser");
const Sequelize = require("sequelize");

const app = express();
const port = 8080;

app.use(bodyParser.json());

///////////////// Database Configuration /////////////////
const sequelize = new Sequelize("database", "username", "password", {
    host: "0.0.0.0",
    dialect: "sqlite",
    storage: "./database.sqlite"
});

///////////////// Database Connection Check /////////////////
sequelize
    .authenticate()
    .then(() => {
        console.log("Connection has been established successfully.");
        defineAccounts();
        setup();
    })
    .catch((err) => {
        console.error("Unable to connect to the database:", err);
    });

///////////////// Create New Table /////////////////
function defineAccounts() {
    Account = sequelize.define(
        "accounts",
        {
            // Add more fields here
            // refer: https://dev.to/projectescape/the-comprehensive-sequelize-cheatsheet-3m1m
            balance: {
                type: Sequelize.INTEGER
            },
            income: {
                type: Sequelize.INTEGER
            },
            expense: {
                type: Sequelize.INTEGER
            }
        },
        {
            timestamps: false,
            createdAt: false,
            updatedAt: false
        }
    );
    return Account;
}

///////////////// Create New Instance /////////////////
function setup() {
    // TODO : change to sync() if you dont want to delete the table each time you run
    Account.sync({ force: true }).then(() => {
        Account.create({
            balance: 0,
            income: 0,
            expense: 0
        });
    });
}

///////////////// API /////////////////

// Get all accounts
app.get("/accounts", (req, res) => {
    Account.findAll().then((account) => {
        res.send(account);
    });
});

// update account instance
// update the account using react axios using the below json format, pass the id in your path(in frontend)
app.put("/accounts/:id", (req, res) => {
    const { id } = req.params;
    const data = req.body;

    Account.findByPk(id).then(async (account) => {
        await account.update({
            balance: data.balance,
            income: data.income,
            expense: data.expense
        });
        res.send(`successfully updated account of id: ${id}`);
    });
});

///////////////// App Listen /////////////////
app.listen(port, () =>
    console.log(`Example app listening on port http://localhost/${port}`)
);

// TO RUN THE APP:
// node .
// The app is tested using Insomnia - download https://insomnia.rest/download
// export the accounsAPI file on Insomnia. right click on the request and click generate code option
// mention javascript / axios. the code will be genereated for API call. do this for GET, POST AND DELETE
