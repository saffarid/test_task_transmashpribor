const path = require("path")
const pg = require('pg')
const fs = require('fs')

let client

const getClient = () => {
    if(client == undefined){
        client = new pg.Client()
    }
    return client
}

const init = async () => {
    const pdfPath = path.join(path.resolve(''), '.\\..\\www\\pdf')
    const create = 'create table pdfs (' +
        'id serial primary key, ' +
        'title character varying(30), ' +
        'secret character varying(300), ' +
        'pdf_data bytea' +
        ');'

    const insert = 'insert into pdfs(title, secret, pdf_data) values($1, $2, $3)'

    try {
        const res = await client.query(create)

        const files = fs.readdirSync(pdfPath)

        for (let fileName of files){
            const title = fileName.split('.')[0]
            let dirs = pdfPath.split('\\');
            const secret = `${dirs[dirs.length-1]}/${fileName}`

            const file = fs.readFileSync(`${pdfPath}\\${fileName}`)
            await client.query(insert, [title, secret, file])
        }

    } catch (err){
        console.log(['error', err])
    }

}

const select = async (data) => {
    const select = `select * from ${data.tableName}`
    const res = await client.query(select)
    return res.rows
}

/**
 * Функция выполняет некоторую комманду с базой данных.
 * @param url {String} Строка запроса к БД
 * @param data {Object} В зависимости от выполняемой комманды этот параметр имеет различные назначения:
 * для комманды вставки - добавляемые данные;
 * для комманды обновления - обновляемые данные:
 * для комманды удаления - удаляемые данные;
 * для комманды выборки - Условие выборки (по id, по custom_keys, выборка нескольких документов)
 * */
const execute = (data) => {
    switch (data.func) {
        case 'select': {
            return select(data.request)
        }
        default: {
            return new Promise((resolve, reject) => {
                reject({
                    responseCode: 400,
                    message: 'Запрос на несущетвующий ресурс'
                })
            })
        }
    }
}

module.exports = {
    execute,
    getClient,
    init
}