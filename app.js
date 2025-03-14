if(process.env.NODE_ENV != "production"){
  require('dotenv').config()
}

const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require('method-override');
const engine = require('ejs-mate');
const ExpressError = require("./utils/ExpressError.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const user = require("./model/user.js");

const db_URL = process.env.ATLASDB_URL;

main()
  .then(console.log("conection successfull"))
  .catch(err => console.log(err));

async function main() {
  await mongoose.connect(db_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.engine('ejs', engine);

app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

const store = MongoStore.create({
  mongoUrl : db_URL ,
  crypto:{
    secret:process.env.SECRET
  },
  touchAfter:24*60*60
})

const sessionOptions ={
  store,
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized:true ,
  cookie : {
    expires:Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge:7 * 24 * 60 * 60 * 1000 ,
    httpOnly:true
  }
}

store.on("error" ,()=>{
  console.log("ERROR in session");
})

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use((req,res,next)=>{
  console.log(req.user);
  res.locals.successMsg = req.flash("success");
  res.locals.errorMsg = req.flash("error");
  res.locals.currUser = req.user;
  next();
})

//listen to all route
app.listen(port, () => {
  console.log(`Server started at port ${port}`);
})

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

//invalid route error handling
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "invalid route"));
})

//error handling route
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Some error occured" } = err;
  res.status(statusCode).render("error.ejs", { message });
})