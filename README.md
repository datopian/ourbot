ChatOps Bot for our Gitter Chat Channel
=======================================

[![Build Status](https://travis-ci.org/datopian/ourbot.svg?branch=master)](https://travis-ci.org/datopian/ourbot)

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
    "docs": {
        "gdoc1": {
            "fun": "sendMessage",
            "dest": "gdocid1"
        },
        "gist1": {
            "fun": "sendGist",
            "dest": "gistid"
        },
        "gdoc2": {
            "fun": "sendMessage",
            "dest": "gdocid2"
        }
    },
    "monitor": {
        "+todo": {
            "action": "log",
            "dest": ["gdoc1", "gist1"]
        },
        "+standup": {
            "action": "log",
            "dest": ["gdoc1"]
        },
        "+example": {
            "action": "log",
            "dest": ["gdoc2"]
        }
    }
}
```

With the configurations above bot will log `+todo`'s in one of Google docs and Gist,
`+standup`'s only in Google doc and `+example` in another Google doc

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
      * Format your document with next columns: action, timestamp, poster, assignees, message, room
    * Look at URL and find this one section:
    * https://docs.google.com/spreadsheets/d/**15dxhLpRnc1_weGE2rdfSYx7FpQfakbSXrh93cMRIuwsFow**/edit#gid=0
    * Set it to `dest` property in config.json:
      ```
      {
        "docs": {
          "gdoc1": {
              "fun": "sendMessage",
              "dest": "15dxhLpRnc1_weGE2rdfSYx7FpQfakbSXrh93cMRIuwsFow"
          },
          ...
      }
      ```

### Gists

1. You need to create gist, by the bot account with name "log.txt"
2. Extract gist id from it's URL
3. Set it to `dest` property in config.json as shown in example above

### Environment Variables

1. Rename ```env.example``` to ```.env``` and set variables:
```
GOOGLE_PRIVATE_KEY="<private_key from JSON file you get from Google>"
GOOGLE_CLIENT_EMAIL=<client_email from JSON file you get from Google>
HUBOT_GITTER2_TOKEN=<Gitter tocken>
GIST_USERNAME="<BOT_USERNAME>"
GIST_PASSWORD="<BOT_PASSWORD>"
```

### Run Locally

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

To keep bot alive on Heroku you need to set following environment variables:
* `HUBOT_HEROKU_KEEPALIVE_URL` - required, the complete URL to keepalive, including a trailing slash.
* `HUBOT_HEROKU_WAKEUP_TIME` - optional,  the time of day (HH:MM) when hubot should wake up.  Default: 6:00 (6 am)
* `HUBOT_HEROKU_SLEEP_TIME` - optional, the time of day (HH:MM) when hubot should go to sleep. Default: 22:00 (10 pm)
* `HUBOT_HEROKU_KEEPALIVE_INTERVAL` - the interval in which to keepalive, in minutes. Default: 5

You *must* set `HUBOT_HEROKU_KEEPALIVE_URL` and it *must* include a trailing slash – otherwise the script won't run.
You can find out the value for this by running `heroku apps:info`. Copy the `Web URL` and run:

```
heroku config:set HUBOT_HEROKU_KEEPALIVE_URL=PASTE_WEB_URL_HERE
```
For additional info follow this [link](https://github.com/hubot-scripts/hubot-heroku-keepalive)

Deploy on heroku

```
$ git push heroku master
```
