const express = require("express")
const app = express()
const http = require("http").createServer(app)
const mongodb = require("mongodb")
 

const MongoClient = mongodb.MongoClient
const ObjectId = mongodb.ObjectId;
 


const expressFormidable = require("express-formidable")
app.use(expressFormidable({
    multiples: true,
}));
const fileSytem = require("fs")

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
 
global.jwtSecret = "jwtSecret1234567890";

const auth = require("./modules/auth");
const tickets = require("./modules/tickets")

app.use(function (req, res, next) {

    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE")
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type,Authorization")
    res.setHeader("Access-Control-Allow-Credentials", true)
    next();
});




const port = (process.env.PORT || 4000)

http.listen(port, function () {
    console.log("Server has been started at: " + port)


    MongoClient.connect("mongodb+srv://thongowen:t123456@cluster0.4cushaz.mongodb.net/test", function (error, client) {
        if (error) {
            console.error(error)
            return
        }
 
        db = client.db("vuejs")
        global.db = db
        console.log("Database connected")
        tickets.init(app)
  
app.post("/logout", auth, async function (request, result) {
    const user = request.user
   
 
    await db.collection("users").findOneAndUpdate({
        _id: user._id
    }, {
        $set: {
            accessToken: ""
        }
    })
 
    result.json({
        status: "success",
        message: "Logout successfully."
    })
})
    app.post("/getUser", auth, async function (request, result) {
        const user = request.user;
     
        result.json({
            status: "success",
            message: "Data has been fetched.",
            user: user
        });
    });

app.post("/login", async function (request, result) {

    const email = request.fields.email;
    const password = request.fields.password;
 
    const user = await db.collection("users").findOne({
        "email": email
    });
 
    if (user == null) {
        result.json({
            status: "error",
            message: "Email does not exists."
        });
        return;
    }
 
    bcrypt.compare(password, user.password, async function (error, isVerify) {
        if (isVerify) {
 

            const accessToken = jwt.sign({
                "userId": user._id.toString()
            }, jwtSecret);
 

            await db.collection("users").findOneAndUpdate({
                "email": email
            }, {
                $set: {
                    "accessToken": accessToken
                }
            });
 
            result.json({
                status: "success",
                message: "Login successfully.",
                accessToken: accessToken
            });
 
            return;
        }
 
        result.json({
            status: "error",
            message: "Password is not correct."
        }
        );
    }
    );
}
);// login
    app.post("/registration", async function (request, result) {
        const name = request.fields.name;
        const email = request.fields.email;
        const password = request.fields.password;
        const createdAt = new Date().getTime();
 
        if (!name || !email || !password) {
            result.json({
                status: "error",
                message: "Please enter all values."
            });
            return;
        }
 
        // check  email 
        var user = await db.collection("users").findOne({
            email: email
        });
 
        if (user != null) {
            result.json({
                status: "error",
                message: "Email already exists."
            });
            return;
        }

        bcrypt.hash(password, 10, async function (error, hash) {
 
            await db.collection("users").insertOne({
                name: name,
                email: email,
                password: hash,
                accessToken: hash,
                role: "user",
                createdAt: createdAt
            });
 
            result.status(200).json({
                status: "success",
                message: "Account has been created. Please login now."
            });
   
        });
      });
    });
  });