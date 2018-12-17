# Google Calendar Node.js Quickstart

Complete the steps described in the [quickstart instructions](
https://developers.google.com/calendar/quickstart/nodejs), and in about five
minutes you'll have a simple Node.js command-line application that makes
requests to the Google Calendar API.

## Install

`npm install`

## Run

After following the quickstart setup instructions, run the sample:

`npm start`

# More on the Calendar API
To work effectively with the **Google Calendar API**, along with *Google APIs* as a whole and making *Service-to-Service API calls* please read on.

## Installing dependencies (*Optional, required for below tutorial*)

```npm
npm install express, body-parser
```

## A step by step guide to programming with *Google Calendar API*. 
*Disclaimer: Some steps might overlap the existing documentation*

- Please follow the steps found on Google Documentation regarding *aquiring access and user consent* etc.
- Once you have a project configured on the **Google Console** and the *API and OAuth keys*, you can proceed here

### Required dependencies for below samples
```javascript
const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const fs = require('fs');
const { google } = require('googleapis');
```
### Required declarations
We must define the `SCOPES` and `TOKEN` Path as required. We are using `Calendar` and `Calendar.Events`
```javascript
const SCOPES = ['https://www.googleapis.com/auth/calendar.events', 'https://www.googleapis.com/auth/calendar'];
const TOKEN_PATH = 'token.json';
```

### Starting a server
To start a server, we can use `expressjs`. *You must be familiar with the function express().listen()*
```javascript
//Specify the port number and other globals!
var port = process.env.PORT || 3501;
var oAuth2Client, token, credentials;

app.listen(port, () => {
    //Read the credentials file.
    fs.readFile("credentials.json", (err, content) => { //Credentials file is named the same 
        if (err) {
            console.log("Error occurred", err);
        }
        else {
            //If success, then store the credentials inside variable for reuse and configure the OAuth2 Client
            content = JSON.parse(content.toString());
            credentials = content.web;
            oAuth2Client = new google.auth.OAuth2(credentials.client_id, credentials.client_secret, credentials.redirect_uris[0]);
            console.log("Credentials read, OAuth2Client Created \nStarted Listening on " + port);
        }
    });
});
```
Next, start the server with a command like 
`node index.js`

i.e. If you haven't configured the `package.json`.

### Authorization
Now let us generate the Authorization URL, which is sent to the client so that the we can request user consent!

```javascript
//Endpoint to begin the authorization process
app.get("/api/authorize", (req, res) => {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline', //Important for service to service calls.
        scope: SCOPES, //Previously defined as a global
    });
    res.send(authUrl);
});
```
On successful authorization, i.e. *when the user provides consent*, Google redirects the flow to a specified `redirect_uri`, in this case `localhost:3501/auth`
with **query parameters** `code=sadbsajkdgjkn23njkwjf....` and `scope=https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar ...`

Next, we must generate an Authorization token, which gets stored at `TOKEN_PATH`, which we do so by calling `oAuth2Client.getToken()` and passing in the `code` as shown below!

```javascript
//Simple endpoint that consumes the code, creates the TOKEN File and redirects to Home.
app.get("/auth", (req, res) => {
    if (req.query) {
        //Could be extra step
        if (req.query.code) {
            oAuth2Client.getToken(req.query.code, (err, token) => {
                if (err) return console.error('Error retrieving access token', err);
                oAuth2Client.setCredentials(token);
                // Store the token to disk for later program executions
                console.log("Creating Token File");
                fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                    if (err) {
                        console.error(err);
                        res.redirect("/home?error=true&message=" + encodeURI("Unable to read token"));
                    }
                    else {
                        res.redirect("/home?error=false");
                    }
                });
            });
        }
        else
            res.redirect("/home?error=true&message=" + encodeURI("Code not available"));
    }
    else
        res.redirect("/home?error=true&message=" + encodeURI("Query param not set in request"));
});
```
You can ignore the responses as they are only for this example.

Basically upon successfully generating a Token, the server redirects the client to `/home`

### GET /calendars
#### Listing existing calendars
To do so, we have to use the `google.calendar.calendarList.list` function as shown below.

```javascript
//Simple endpoint that returns a list of calendars and their IDs.
app.get("/calendars", (req, res) => {

    fs.readFile("token.json", (err, data) => {
        if (err)
            res.send("Error reading your file");
        else {
            token = JSON.parse(data.toString());
            oAuth2Client.setCredentials(token);
            const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });
            calendar.calendarList.list({
              //Options not mandatory
            }, (err, result) => {
                if (err)
                    res.send(err);
                else
                    //Notice how the calendars are buried deep within the result object. I was returning {} until I printed out the result once.
                    res.json(result.data.items.map(c => { return { id: c.id, name: c.summary } })); 
            });
        }
    });
});
```
### POST /calendars 
#### Creating a Calender 
Here we must pass a calendar name within the POST request body for our service. We must use the `google.calendar.calendars.insert` function. 

```javascript
//Endpoint for POST new Calendar to your Google account.
app.post("/calendars", (req, res) => {
    //Get body param summary.
    var calname = req.body.summary || false;
    if (calname) {
        fs.readFile("token.json", (err, data) => {
            if (err)
                res.send("Error reading your TOKEN file");
            else {
                token = JSON.parse(data.toString());
                oAuth2Client.setCredentials(token);
                const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });
                calendar.calendars.insert({ //Important, has to be within a resource object.
                    resource: {
                        summary: calname //cannot set color yet. summary is the calendar title.
                    }
                }, (err, result) => {
                    //Important, result is stored deep within the data object. 
                    if (err)
                        res.send(err);
                    else
                        res.json(result.data);
                });
            }
        });
    }
    else
        res.send("Calendar Name required!");
});
```
// Again feel free to ignore the response and create your own.

### GET /events 
#### Getting primary Calendar events
We must use the `google.calendar.events.list` function with optional params.

```javascript
//Simple endpoint, which doesn't consider a specific calendar, only returns the primary calendar events.
//This endpoint is using two query params to control the data retreived, i.e. timeMin and maxResults.
app.get("/events", (req, res) => {
    fs.readFile("token.json", (err, data) => {
        if (err)
            res.send("Error reading your file");
        else
            token = JSON.parse(data.toString());
        oAuth2Client.setCredentials(token);
        const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });
        calendar.events.list({ //Optional Parameters 
            calendarId: 'primary',
            timeMin: req.query.timeMin, 
            maxResults: req.query.maxResults,
            singleEvents: true,
            orderBy: 'startTime',
        }, (err, result) => {
            if (err) return console.log('The API returned an error: ' + err);
            const events = result.data.items; //Again events are buried deep within the result. Extract them carefully!
            if (events.length) {
                res.json(events);
            } else {
                res.send("No upcoming events!");
            }
        });

    });
});
```
### GET /logout
#### A simple logout technique.

```javascript
//Just delete the TOKEN File.
app.get("/logout", (req, res) => {
    fs.unlink("token.json", (err) => {
        if (err)
            res.json({ valid: false, message: "Unable to delete file" });
        res.send({ valid: true, message: "Logged out successfully!" });
    });
});
```
### Conclusion
This should bring you up to speed while developing with Google Calendar API. It only gets easier!
This is just a simple web app. For more complex apps, with multiple users, obviously you'll need to generate multiple TOKEN files and manage them. It would be recommended to store the tokens on a database. Also an added advantage of using Google API clients is that access tokens are automatically refreshed!




















