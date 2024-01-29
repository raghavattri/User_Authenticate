const express = require('express');
const cors = require('cors')
const mongoose = require('mongoose')
const User = require('./model/usermodel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const bodyParser =  require('body-parser');

const app =  express();


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));



app.post('/register', async (req, res) => {
	console.log(req.body)
	try {
		const newPassword = await bcrypt.hash(req.body.password, 10)
		await User.create({
			name: req.body.name,
			email: req.body.email,
			password: newPassword,
		})
		res.json({ status: 'ok' })
	} catch (err) {
		res.json({ status: 'error', error: 'Duplicate email' })
	}
})

app.post('/login', async (req, res) => {
	const user = await User.findOne({
		email: req.body.email,
	})

	if (!user) {
		return { status: 'error', error: 'Invalid login' }
	}

	const isPasswordValid = await bcrypt.compare(
		req.body.password,
		user.password
	)

	if (isPasswordValid) {
		const token = jwt.sign(
			{
				name: user.name,
				email: user.email,
			},
			 // secret key
            'secret123'
		)

		return res.json({ status: 'ok', user: token })
	} else {
		return res.json({ status: 'error', user: false })
	}
})




const url = 'mongodb+srv://raghav75way:random1234@cluster0.nzvommb.mongodb.net/mern?retryWrites=true&w=majority'

mongoose.connect(url).then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });



app.listen(5000,()=>{
    console.log("server is running")
})