const express = require('express')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const app = express()


app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs')
var db

//mongodb://<admin>:<admin@1234>@ds125126.mlab.com:25126/sopan-starwars

MongoClient.connect('mongodb://admin12:admin12345@ds125126.mlab.com:25126/sopan-starwars', (err, client) => {
    if (err) return console.log(err)
    db = client.db('sopan-starwars') // whatever your database name is
    app.listen(3000, () => {
        console.log('listening on 3000')
    })
})



app.get('/', (req, res) => {
  db.collection('quotes').find().toArray((err, result) => {
    if (err) return console.log(err)
    // renders index.ejs
    res.render('index.ejs', {quotes: result})
  })
})

app.post('/quotes', (req, res) => {
    db.collection('quotes').save(req.body, (err, result) => {
        if (err) return console.log(err)

        console.log('saved to database')
        res.redirect('/')
    })
})