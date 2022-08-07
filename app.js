const express = require("express");
const bodyparser = require("body-parser");
const request = require("request");
const mailchimp = require("@mailchimp/mailchimp_marketing");
const app = express();
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended: true}));

app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html");
});
mailchimp.setConfig({
 apiKey: "fc874be034aedc07bc839dd46053e7fc-us10",
 server: "us10"
});
app.post("/", function(req, res){
    const firstName = req.body.fname;
    const lastName = req.body.lname;
    const email = req.body.email;
    const run = async () => {
    const response = await mailchimp.lists.addListMember("7a7bb430cd", {
      email_address: email,
      status: "subscribed",
      merge_fields:{
        FNAME: firstName,
        LNAME: lastName
      }
    });
  console.log(response);
  res.sendFile(__dirname + "/sucess.html")
   console.log(
  `Successfully added contact as an audience member.
   The contact's id is ${ response.id }.`
  );
};
app.post("/failure", function(req, res){
  res.redirect("/");
});

  run().catch(e => {
      res.sendFile(__dirname + "/fail.html")});
});

app.listen(process.env.PORT || 3000, function(){
    console.log("Server is running");
});
