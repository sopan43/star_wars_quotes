const express = require('express')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const app = express()
const PORT = process.env.PORT || 3000;


app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs')
app.use(express.static('public'))
var db

//mongodb://admin12:admin12345@ds125126.mlab.com:25126/sopan-starwars
//mongodb://heroku_p3x3z7nz:prjvfvdru273q1j4424ovlailm@ds019054.mlab.com:19054/heroku_p3x3z7nz
MongoClient.connect('mongodb://heroku_p3x3z7nz:prjvfvdru273q1j4424ovlailm@ds019054.mlab.com:19054/heroku_p3x3z7nz', (err, client) => {
    if (err) return console.log(err)
    db = client.db('heroku_p3x3z7nz') // whatever your database name is
    app.listen(PORT, () => {
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


app.put('/quotes', (req, res) => {
	console.log(req.body);
  db.collection('quotes')
  .findOneAndUpdate({name: 'Yoda'}, {
    $set: {
      name: req.body.name,
      quote: req.body.quote
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.json(result)
  })
})

app.delete('/quotes', (req, res) => {
	console.log(req.body);
  db.collection('quotes').findOneAndDelete({name: req.body.name},
  (err, result) => {
    if (err) return res.send(500, err)
    res.json({message: 'A darth vadar quote got deleted'})
  })
})
