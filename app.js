const path = require('path');//ta paczka wbudowana w node.js

const express = require('express');
const db = require('./data/database');
const authRoutes = require('./routes/auth.routes');


const app = express();

app.set('view engine','ejs');//define views
app.set('views',path.join(__dirname,'views'));//definicja sciezki do widokow

app.use(express.static('public'));//folder z static content dostepny dla wszystkiczh

app.use(express.urlencoded({ extended:false}));//by moc przekazywac regularne parametry (name) z  formsow z post do funkcji w controlerze

app.use(authRoutes);

db.connectToDatabase().then(function(){
    app.listen(3000);
}).catch(function(error){
    console.log('Failed to connect to the database!');
    console.log(error);
})
