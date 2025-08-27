
require('dotenv').config()
const dbCon=require('./app/config/dbCon')
const express=require('express')
const cors=require('cors')
const path=require('path')
const ejs=require('ejs')
const flash = require('connect-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');

const app=express()
dbCon()

// app.use((req, res, next) => {
//   res.setHeader(
//     "Content-Security-Policy",
//     "default-src 'self'; connect-src 'self' http://localhost:5000"
//   );
//   next();
// });

app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; " +
    "connect-src 'self' http://localhost:5000; " +
    "script-src 'self' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com; " +
    "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com; " +
    "font-src 'self' https://cdnjs.cloudflare.com; " +
    "img-src 'self' data:;"
  );
  next();
});

app.use(cors())

app.use(cookieParser());

app.get('/set-cookie', (req, res) => {
  res.cookie('testcookie', 'hello-world', {
    httpOnly: false,
    sameSite: 'lax',
    secure: false,
    path: '/'
  });
  res.send('Test cookie set');
});


 // Session & Flash
app.use(session({
  secret: process.env.SESSION_SECRET || 'helloworld',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60 * 60 * 1000 }, // 1 hour
}));
app.use(flash());

app.set('view engine','ejs');
app.set('views','views')
// Method override for PUT/DELETE
app.use(methodOverride('_method'));

//setup json
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(__dirname + '/public'));
app.use(express.static('public')); 
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
//routes
const adminRoute=require('./app/routes/adminRoutes')
app.use(adminRoute)

const PORT=process.env.PORT || 4000

app.listen(PORT,()=>{
    console.log(`🚀🚀🚀 server is running at : ${PORT}`)
})


   
 
