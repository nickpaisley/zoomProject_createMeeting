const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
var http = require('http').Server(app);
const path = require('path');
const fs = require('fs')
const rp = require('request-promise');
const jwt = require('jsonwebtoken');
const copy = require('clipboard-copy')
require('dotenv').config()

 
const payload = {
    iss: process.env.zoom_client_ID,
    exp: ((new Date()).getTime() + 5000)
};
const token = jwt.sign(payload, process.env.zoom_client_secret);
 
 
app.get("/newmeeting", (req, res) => {
  email = "nick@paisleydevelopment.com";
  var options = {
    method: "POST",
    uri: "https://api.zoom.us/v2/users/" + email + "/meetings",
    body: {
      topic: "test meeting title",
      type: 1,
      settings: {
        host_video: "true",
        participant_video: "true"
      }
    },
    auth: {
      bearer: token
    },
    headers: {
      "User-Agent": "Zoom-api-Jwt-Request",
      "content-type": "application/json"
    },
    json: true //Parse the JSON string in the response
  };
 
  rp(options)
    .then(function(response) {
      console.log("response is: ", response);
      resp = response
      var title ='<center><h3>Meeting Information:</h3></center>'
      var startLinkRaw = JSON.stringify(resp.start_url, null, 2)
      var startLinkDisplay = '<center><h3>Start URL = ' + (JSON.parse(startLinkRaw)) + '</h3></center>'
      var joinLinkRaw = JSON.stringify(resp.join_url, null, 2)
      var joinLinkDisplay = '<center><h3>Join URL = ' + (JSON.parse(joinLinkRaw)) + '</h3></center>'
      var clickLink = JSON.parse(startLinkRaw)

      //console.log(JSON.parse(link))
      var result = title + startLinkDisplay + joinLinkDisplay + '<center><h2><a href="'+ clickLink +'"> Click Here to Start Meeting</a></h2></center>' +
      '<code><pre style="background-color:#aef8f9;">'+ JSON.stringify(resp, null, 2) + '</pre></code>'
      res.send(result);
      //res.send("create meeting result!: " + JSON.stringify(response, null, 2));
      
    })
    .catch(function(err) {
      // API call failed...
      console.log("API call failed, reason ", err);
    });
});
 
http.listen(port, () => console.log(`Listening on port ${port}`));