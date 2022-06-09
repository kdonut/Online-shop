const path = require('path');//ta paczka wbudowana w node.js



const csrf = require('csurf');
const express = require('express');
const createSessionConfig = require('./config/session');



const expressSession = require('express-session');

const addCsrfTokenMW = require('./middlewares/csrf-token-mw');
const errorHandlerMW = require('./middlewares/error-handler-mw');
const checkAuthStatusMW = require('./middlewares/check-auth-mw');
const protectRoutesMW = require('./middlewares/protect-routes-mw');
const cartMW = require('./middlewares/cart-mw');

const db = require('./data/database');
const baseRoutes = require('./routes/base.routes');
const authRoutes = require('./routes/auth.routes');
const productsRoutes = require('./routes/products.routes');
const adminRoutes = require('./routes/admin.routes');
const cartRoutes = require('./routes/cart.routes');
const ordersRoutes = require('./routes/orders.routes');



const app = express();

app.set('view engine','ejs');//define views
app.set('views',path.join(__dirname,'views'));//definicja sciezki do widokow

app.use(express.static('public'));//folder z static content dostepny dla wszystkiczh
app.use('/products/assets',express.static('product-data'));
app.use(express.urlencoded({ extended:false}));//by moc przekazywac regularne parametry (name) z  formsow z post do funkcji w controlerze
app.use(express.json());//wazne by obsluzyc json


const sessionConfig = createSessionConfig();
app.use(expressSession(sessionConfig));

///najlepiej csurf przed Routs
app.use(csrf());
app.use(cartMW);
app.use(addCsrfTokenMW);
app.use(checkAuthStatusMW);

app.use(baseRoutes);
app.use(productsRoutes);
app.use('/cart',cartRoutes);
app.use(authRoutes);
app.use(protectRoutesMW);
app.use('/admin',adminRoutes);
app.use('/orders',ordersRoutes);

app.use(errorHandlerMW);
///eror handling


db.connectToDatabase().then(function(){
    app.listen(3000);
}).catch(function(error){
    console.log('Failed to connect to the database!');
    console.log(error);
})
