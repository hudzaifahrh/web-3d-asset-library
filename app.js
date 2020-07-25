const https = require('https');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongodb = require('mongodb');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');
const errorController = require('./controllers/error');
const User = require('./models/user');
const obj2gltf = require('obj2gltf');
const fs = require('fs');
const MONGODB_URI = 'mongodb://hudzaifahrh:*******@x1.hcm-lab.id:27072/shop?authSource=admin';

const app = express();
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
});
const csrfProtection = csrf();

const server = https.createServer({
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.crt')
}, app);

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === 'upload') {
            cb(null, 'uploads')
        } else if (file.fieldname === 'image') {
            cb(null, 'images')
        }
    },
    filename: (req, file, cb) => {
        if (file.fieldname === 'upload') {
            cb(null, file.originalname);
        } else if (file.fieldname === 'image') {
            cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
        }

    }
});

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());
app.use(multer({storage: fileStorage}).fields(
    [
      { 
        name: 'upload', 
        maxCount: 1 
      }, 
      { 
        name: 'image', 
        maxCount: 1 
      }
    ]
  )
);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/logo', express.static(path.join(__dirname, 'logo')));

app.use(
    session({ 
        secret: 'my secret', 
        resave: false, 
        saveUninitialized: false,
        store: store 
    })
);
app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
    .then(user => {
        if (!user) {
            return next();
        }
        req.user = user;
        next();
    })
    .catch(err => {
        next(new Error(err));
    });
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get('/500', errorController.get500);
app.use(errorController.getError);
app.use((error, req, res, next) => {
    res.status(500).render('500', { 
        pageTitle: 'Error!', 
        path: '/500',
        isAuthenticated: req.session.isLoggedIn
    });
});

mongoose
    .set('useUnifiedTopology', true)
    .connect(MONGODB_URI, { useNewUrlParser: true })
    .then(result => {
        const port = 3001;
        app.listen(3000);
        server.listen(port, () => {
            console.log(`Server is up on https://localhost:${port}`);
            console.log('CORS-enabled web server listening on port 3001');
       });
    })
    .catch(err => {
        console.log(err);
    });
