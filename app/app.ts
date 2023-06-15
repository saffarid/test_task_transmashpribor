require('dotenv').config()

const bodyParser = require("body-parser")
const fs = require("fs")
const path = require('path')
const express = require("express")
const db = require('./js/database.ts')
const pdf = require('./js/pdf.ts')
const paths = require("./js/paths.ts")

// const bodyParser = require("body-parser")

/**
 * Парсер json-в запросах
 * */
const jsonParser = express.json();

const {APP_PORT, APP_IP, APP_PATH} = process.env;
const urlIndex = path.join(path.resolve(''), './../www/index.html')
const staticPath = paths.paths.staticPath;
const app = express()

const client = db.getClient()
/*
* Подключаемся к БД, при удачном подключении подвязываем к серверу слушателя подключений
* */
client.connect(async (err) => {
    if (err) return console.error(err)
    // Нужна инициализация БД
    await db.init()
    app.listen(20200, () => {
        console.log(`Wait connection to http://${APP_IP}:${APP_PORT}`)
    })

})
app
    .use(bodyParser.json({limit: '50mb'}))
    .use(express.static(staticPath))
    .get('/', (req, res) => {
        fs.readFile(urlIndex, (err, data) => {
            if (err) {
                res.writeHead(400, {'Content-Type': 'text/plain'});
                res.write('index.html not found');
            } else {
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(data);
            }
            res.end();
        })
    })
    .post(/\/pdf/, (req, res) => {
        console.log(req)
        if (!req.body) res.sendStatus(400)
        pdf.execute(req.body)
            .then(data => {
                res.json(data)
            })
            .catch((err) => {
                res.json(err)
            })
    })
