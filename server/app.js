
require('dotenv').config()
const express=require('express')
const dbCon=require('./app/config/dbCon')
const cors=require('cors')
const path=require('path')
const ejs=require('ejs')
const app=express()
const flash = require('connect-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
dbCon()

app.set('view engine','ejs');
app.set('views','views')
// Method override for PUT/DELETE
app.use(methodOverride('_method'));
app.use(cors({
  origin: 'http://localhost:5173',  //  frontend's URL
  credentials: true                //  allow cookies/session
}));
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
// // Session & Flash
app.use(session({
  secret: process.env.SESSION_SECRET || 'helloworld',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60 * 60 * 1000 }, // 1 hour
}));
app.use(flash());
//setup json
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(__dirname + '/public'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))


//frontend user routes
// const userRoutes=require('./app/routes/usersRoutes')
// app.use('/api/users',userRoutes)

// //front end auth
const authRoutes=require('./app/routes/authRoutes')
app.use('/api/auth',authRoutes)

//post
const postRoutes=require('./app/routes/postsRoutes')
app.use('/api/posts',postRoutes)

//profile
const profileRoutes=require('./app/routes/profileRoutes')
app.use('/api/profile',profileRoutes)

//backend admin
const adminRoute=require('./app/routes/adminRoutes')
app.use('/admin', adminRoute);
const PORT=process.env.PORT || 5000

app.listen(PORT,()=>{
    console.log(`🚀🚀🚀 server is running at : ${PORT}`)
})