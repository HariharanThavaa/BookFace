const express = require('express');
const bodyParser = require('body-parser')
const app = express();
app.set('view engine','ejs')
app.use(bodyParser.json())
app.use(express.static('public'))
const MongoClient = require('mongodb').MongoClient
var ObjectId = require('mongodb').ObjectId
var session = require('client-sessions');
var nodemailer = require('nodemailer');

app.use(session({
  cookieName: 'session',
  secret: 'random_string_goes_here',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
}));

var uri = "mongodb://harimaniam:Password@cluster0-shard-00-00-kqjyc.mongodb.net:27017,cluster0-shard-00-01-kqjyc.mongodb.net:27017,cluster0-shard-00-02-kqjyc.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin";
var db
var username = ''
var mail = ''

MongoClient.connect(uri, (err, database) => {
  if (err) return console.log(err)
  db = database.db('star-wars-quotes')
  app.listen(3000, () => {
    console.log('listening on 3000')
  })
})

app.use(bodyParser.urlencoded({extended: true}))

app.get('/signup', (req, res) => {
	res.render('login.ejs', {})
})

app.get('/signout', (req, res) => {
	console.log('signout')
	req.session.username = ''
	req.session.mail = ''
	username = '';
	mail = '';
	res.redirect('/')
})

//=======================================================================
//===============Send Mail Code Comes here ==============================
//=======================================================================
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'bookfacethava@gmail.com',
    pass: 'test@cbsd'
  }
});

var mailOptions = {
  from: 'bookfacethava@gmail.com',
  to: 'harimaniam@gmail.com',
  subject: 'Mail Authentication for your Bookface account',
  html: "<a href='#'>testing</a>"
};

app.get('/authmail',(req,res) => {
	console.log('username in sign up : ' + req.query.name)
	console.log('mail in sign up : ' + req.query.mail)
	req.session.username = req.query.name
	req.session.mail = req.query.mail
	res.redirect('/')
})

app.post('/signup', (req,res) => {
	mailOptions.to = req.body.mail
	mailOptions.html = "click <a href='http://localhost:3000/authmail?name="+req.body.name+"&mail="+req.body.mail+"'>here</a> to sign up"

	transporter.sendMail(mailOptions, function(error, info){
	  if (error) {
	    console.log(error);
	  } else {
	    console.log('Email sent: ' + info.response);
	  }
	});
	res.redirect('/')
})

app.get('/', (req, res) => {
  db.collection('authors').find().toArray((err, result) => {
    if (err) return console.log(err)
	if( req.session && req.session.username && req.session.mail){
		username = req.session.username;
		mail = req.session.mail;
	}
	console.log('username : ' + username)
	console.log('mail : ' + mail)
    res.render('index.ejs', {authors: result, username: username, mail: mail})
  })
})


// Add/Edit/View Authors Screen
app.get('/authors', (req, res) => {
	if( req.session && req.session.username && req.session.mail){
			username = req.session.username;
			mail = req.session.mail;
	}
	if ((typeof(req.query._id) !== 'undefined') && (req.query._id!== null)) {
		db.collection('authors')
		  .findOne({_id:ObjectId(req.query._id)}, (err, author) => {
		   if (err) return console.log(err)
		       // Store the results in an aobject
		       console.log("Author details :: " + author.name)
		       db.collection('books').find({author_id:req.query._id}).toArray((err, books) => {
			     		if (err) return console.log(err)
			   		    // renders author.ejs
			   		    res.render('author.ejs', {books: books, author: author, type:req.query.type, username: username, mail: mail })
  				})
  		})
	}else{
		res.render('author.ejs', {type:req.query.type, username: username, mail: mail})
	}
})


//delete selected author
app.delete('/authors', (req, res) => {
  db.collection('authors').deleteOne( {_id:ObjectId(req.body._id) },
  (err, result) => {
    if (err) return res.send(500, err)
    res.send({message: 'author got deleted'})
  })
})


app.post('/authors', (req,res) => {
	db.collection('authors').save(req.body, (err, result) => {
	    if (err) return console.log(err)

	    console.log('saved to database')
	    res.redirect('/')
  })
})

app.put('/authors', (req, res) => {
  db.collection('authors')
  .findOneAndUpdate({_id:ObjectId(req.body._id)}, {
    $set: {
      name: req.body.name,
      desc: req.body.desc
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})

//=============================================================
//================Books Starts here=============================
//===============================================================

// Go to Add/View/Edit Books Screen
app.get('/books', (req, res) => {
	if( req.session && req.session.username && req.session.mail){
		username = req.session.username;
		mail = req.session.mail;
	}
	if ((typeof(req.query._id) !== 'undefined') && (req.query._id!== null)) {
		db.collection('books')
			.findOne({_id:ObjectId(req.query._id)}, (err, book) => {
			   if (err) return console.log(err)
			       // Store the results in an aobject
			       console.log("Book details :: " + book.name)
			       db.collection('comments').find({book:req.query._id}).toArray((err, comments) => {
				   		if (err) return console.log(err)
				   		// renders author.ejs
				   		res.render('book.ejs', {comments: comments, book: book, type:req.query.type, auth_id:req.query.auth_id, auth_name:req.query.auth_name, username: username, mail: mail })
  				})

	  		})
		}else{
			console.log("Auth Id : " + req.query.auth_id )
			res.render('book.ejs', {type:req.query.type, auth_id:req.query.auth_id, auth_name:req.query.auth_name, username: username, mail: mail })
	}
})

app.post('/books', (req,res) => {
	console.log("Calling Save method with the body :: " + req.body)
	db.collection('books').save(req.body, (err, result) => {
	    if (err) return console.log(err)
	    res.redirect('/authors?type=Read&_id='+req.body.author_id)
  })
})

//delete selected book
app.delete('/books', (req, res) => {
  db.collection('books').deleteOne( {_id:ObjectId(req.body._id) },
  (err, result) => {
    if (err) return res.send(500, err)
    res.send({message: 'book got deleted'})
  })
})

app.put('/books', (req, res) => {
  db.collection('books')
  .findOneAndUpdate({_id:ObjectId(req.body._id)}, {
    $set: {
      name: req.body.name,
      desc: req.body.desc,
      author_name: req.body.author_name,
      author_id: req.body.author_id
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})

//=============================================================
//================Comments Starts here=========================
//=============================================================

app.post('/comments', (req,res) => {
	db.collection('comments').save(req.body, (err, result) => {
	    if (err) return console.log(err)
	    res.redirect('/books?type=Read&auth_id='+req.body.author+'&auth_name='+req.body.author_name+'&_id='+req.body.book)
  })
})

//delete selected comment
app.delete('/comments', (req, res) => {
  db.collection('comments').deleteOne( {_id:ObjectId(req.body._id) },
  (err, result) => {
    if (err) return res.send(500, err)
    res.send({message: 'comments got deleted'})
  })
})

