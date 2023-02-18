const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const { options } = require("request");

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));


app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
})

app.post("/", function (req, res) {
     const firstName = req.body.fname ; 
     const lastName = req.body.lname ; 
     const email = req.body.email ; 
    //  console.log(firstName, lastName, email);

     const data = {
         members: [
             {
                 email_address: email,
                 status: "subscribed",
                 merge_fields: {
                     FNAME: firstName,
                     LNAME: lastName
                 }
             }
         ]
     }
     var jsonData = JSON.stringify(data);

     const url = "https://us13.api.mailchimp.com/3.0/lists/e487727edc"

     const options = {
         method: "POST",
         auth: "vineet21:b75592923f70b0230fc0a0d97b8c2f8c-us13"
     }
     const request = https.request(url, options, function (response) {

        if(response.statusCode === 200){
            res.sendFile(__dirname + "/success.html");
        }
        else{
            res.sendFile(__dirname + "/failure.html");
        }

         response.on("data", function (data) {
             console.log(JSON.parse(data));
         })
     })
     request.write(jsonData);
     request.end();
}) 

app.post("/failure.html", function (req, res) {
    res.redirect("/");
})

app.listen(process.env.PORT || 3000, function () {
    console.log("server is running at port 3000.")
})

// api keys = b75592923f70b0230fc0a0d97b8c2f8c-us13
// list id = e487727edc