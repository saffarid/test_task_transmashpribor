const fs = require("fs")
const paths = require("./paths.ts")
const db = require('./database.ts')


const getAll = async () => {
   const entries = await db.execute({
      func: 'select',
      request: {
         tableName: 'pdfs',
      },
   })

   const rows = []

   for (let entry of entries){
      rows.push({
         title: entry.title,
         secret: entry.secret
      })
   }

   return entries
}

const execute = (data) => {
   switch (data.func) {
      case 'getAll':
         return getAll()
      default: {
         return new Promise((resolve, reject) => {
            reject({
               responseCode: 400,
               message: 'Запрос на несущетвующий ресурс',
            })
         })
      }
   }
}

module.exports = {
   execute,
}