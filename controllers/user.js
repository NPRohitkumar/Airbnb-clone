const user = require("../model/user.js");

module.exports.renderSignUpForm = async(req,res)=>{
    res.render("user/signup.ejs");
}

module.exports.signUp = async(req,res)=>{
    try{
        let {email,username,password} = req.body;
        let newUser = new user({email,username});
        const registeredUser = await user.register(newUser , password);
        req.login(registeredUser , (err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to wanderlust");
            res.redirect("/listings")
        })
    } catch(e){
        req.flash("error","Username already exists");
        res.redirect("/signup");
    }
}

module.exports.renderLoginForm = async(req,res)=>{
    res.render("user/login.ejs")
}

module.exports.Login = async(req,res)=>{
    req.flash("success","Welcome to Wanderlust");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

module.exports.logout = (req,res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        } else {
            req.flash("success","You were logged out");
            res.redirect("/listings");
        }
    })
}