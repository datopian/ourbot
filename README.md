ChatOps Bot for our Gitter Chat Channel
=======================================

[![Build Status](https://travis-ci.com/weirdGuy/gitterbot.svg?token=eKyEegu8wsqS6HDsxeah&branch=master)](https://travis-ci.com/weirdGuy/gitterbot)

Our Hubot-based bot to automate lots of stuff including:

- logging of specific messages from our (gitter) chat channel. See #1

## How to use it

In your chat channle tag at start, middle or end of a message:

```
+todo ...
...  +todo ...

... +todo
```

This will get logged to the doc as:

```
yyyy-mm-ddTHH:MM {message} [from:@{username}]

```

## Installation

You'll need to install coffee-script and hubot to run the app and tests. To install follow here:

```
npm install -g hubot coffee-script
```

Install the app:
```
# clone the repo
git clone https://github.com/atomatichq/ourbot.git
cd ourbot
npm install
```
Run the tests
```
npm test
```

### Configuration

For running this one you need to do few really quick steps.

#### Configure the bot

```javascript=
// some of this should be auto loaded from environment variables (so we can config on heroku)

// config.json
{
  github_auth:
  gdocs_auth:
  docs: {
    "gist1": {
      "type": "gist"
    }
    "gdocs1": {
      "type": "gdocs"
    }
  }
  monitor: {
    "+todo": {
      "action"": "log",
      "dest": "gist1"
    },
    "+standup": ...
  }
}
```

This will then match +todo and log to gist1 doc.

#### Gitter

1. Open [gitter dev site](https://developer.gitter.im/docs/welcome)
2. Click Sign in and authorize
3. You will be redirected in private area where you can find your API key, COPY IT!

#### Google Sheets

1. Go to the [Google Developers Console](https://console.developers.google.com/project)
2. Select your project or create a new one (and then select it)
3. Enable the Drive API for your project
  - In the sidebar on the left, expand __APIs & auth__ > __APIs__
  - Search for "drive"
  - Click on "Drive API"
  - click the blue "Enable API" button
4. Create a service account for your project
  - In the sidebar on the left, expand __APIs & auth__ > __Credentials__
  - Click blue "Add credentials" button
  - Select the "Service account" option
  - Select the "JSON" key type option
  - Click blue "Create" button
  - your JSON key file is generated and downloaded to your machine (__it is the only copy!__)
  - note your service account's email address (also available in the JSON key file)
5. Share the doc (or docs) with your service account using the email noted above
6. Get Worksheet ID:
    * Open or create google document
      * Format your document with next columns: action, timestamp, poster, assignees, message
    * Look at URL and find this one section:
    * https://docs.google.com/spreadsheets/d/**15dxhLpRnc1_weGE2rdfSYx7FpQfakbSXrh93cMRIuwsFow**/edit#gid=0
    * Set it in .env file as: ``` GOOGLE_WORKSHEET="15dxhLpRnc1_weGE2rdfSYx7FpQfakbSXrh93cMRIuwsFow" ```

### Environment Variables
1. Rename ```env.example``` to ```.env``` and set variables:
```
GOOGLE_PRIVATE_KEY="<private_key from JSON file you get from Google>"
GOOGLE_CLIENT_EMAIL=<client_email from JSON file you get from Google>
GOOGLE_WORKSHEET=<Worksheed ID from URL of Google spreadsheet>
HUBOT_GITTER2_TOKEN=<Gitter tocken>
```

### Locally

2. Open terminal and go in project folder.
3. Enter next script:
```
  HUBOT_GITTER2_TOKEN=<APIKEY which you get in previous step> bin/hubot -a gitter2 --name ourbot
```

### Heroku

Set the environment variables form `.env` for Heroku

```
$ heroku config:set VARIABLE_NAME=VaRIabLE

## Note: To set `GOOGLE_PRIVATE_KEY` you will have to remove all `\n`s with actual new lines

$ heroku config:set GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
your
very
long
key
-----END PRIVATE KEY-----"
```

Deploy on heroku

```
$ git push heroku master
```
