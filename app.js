const express = require ('express');
const bodyParser = require ('body-parser');
const request =  require("request")
const listId = "f274d01dcd";

//const request = require('request'); Didn't need to use this

const mailchimp = require('@mailchimp/mailchimp_marketing');

const app = express();
//This lets us server static assets like javascript or css
app.use(express.static("public"));

//This line makes it easier to parse the the request by placing the information in the request body.
app.use(bodyParser.urlencoded({extended:true}))

app.get("/",(req,res)=> {
    res.sendFile(__dirname + "/signup.html");
})

app.post("/",(req,res)=> {
    let fn = req.body.firstName
    let ls = req.body.lastName
    let email = req.body.email

    //Object Prepared for Mailchimp
    const subscribingUser = {
      firstName: fn,
      lastName: ls,
      email: email,
    };


    //Mailchimp API Paramenters
    mailchimp.setConfig({
      apiKey: "4862906a4434a9ce4eb4ca3d16888916-us17",

       server: "us17"
    });


    //Mailchimp API POST New Subscriber Function
    async function run() {
      //"Try" this function and if successful do the following
      try {
        const response = await mailchimp.lists.addListMember(listId, {
          email_address: subscribingUser.email,
          status: "subscribed",
          merge_fields: {
            FNAME: subscribingUser.firstName,
            LNAME: subscribingUser.lastName
          }
        });

        //My Custom Response. You can log anything you want, like just the whole 'response' too
        console.log(`${response.merge_fields.FNAME} ${response.merge_fields.LNAME} with email ${response.email_address} has been successfully registered`);

        res.sendFile(__dirname + "/success.html")
      }
      // If the 'Try' function isn't successful, do this on failure.
      catch (err) {
        //This is will return the error code
        console.log(err.status)
        res.sendFile(__dirname + "/failure.html")
      }
    }
    run();
})

app.listen(1000,() => {
    console.log("Listening on port 3000;");
})
