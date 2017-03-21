ChatOps Bot for our Gitter Chat Channel
[![Build Status](https://travis-ci.com/weirdGuy/gitterbot.svg?token=eKyEegu8wsqS6HDsxeah&branch=master)](https://travis-ci.com/weirdGuy/gitterbot)
=======================================

We want a Hubot-based bot to automate logging of specific messages from our gitter chat channel. We want messages logged to a document in google docs or a gist. Tags are like +todo or +standup.

Context: we want to capture things (like todos) in a more findable / trackable form than a chat log but do so without switching context (leaving chat channel)

The task here is to implement a minimum viable product (MVP) -- not a complete solution.

## User Stories

*Note: the MVP need not support all these user stories*

Joe = team member or scrum master

As Joe I want to create a list of tasks for myself or another team member and flag with +todo and have it archived somewhere so that it does not get lost in the chat

As Joe I want to post a link to e.g. a piece of software or a blog post and tag it with +link and have it captured so that I can easily find it later

As Joe I want to send some notes to myself for later (tag +notetoself) so that I can follow up

As Joe I want to be able to create a trello task or github issue from gitter so that I can quickly stub a task without having to switch context

As Joe I want to be able to add a flag like +todo or +pinit (pinboard) and have that item auto-archived to a log somewhere (e.g. a hackmd pad would be perfect

As a team member I want to do my standup in channel and flag with +standup and have this archived for easy review by other team members and future reference

## Implementation

* Our chat channel is gitter. We would potentially have multiple rooms to connect to but the PoC could focus on one.

* Use: Hubot as framework. There is a gitter adapter -  https://github.com/huafu/hubot-gitter2

* We want to store items to one of the following locations:

  * google doc
  * gist
  * [possibly] github issues or docs

* Code should be written in ES6 rather than coffeescript (if possible)

  * This should be possible - see https://coderinserepeat.com/2016/02/14/writing-hubot-scripts-using-es2015/ + https://github.com/github/hubot/issues/1009

* Documentation: provide README.md with a summary of how things work plus installation instructions on e.g. Heroku

* Tests: provide tests (use mocha)

* Coding standards: follow https://github.com/okfn/coding-standards

* Code should be on github - github.com/atomatichq eventually

### MVP

We are requesting an MVP not a full solution.

For the MVP we want a basic daemon that:

- [ ] Monitor one room
  - [ ] Configure which rooms are to be monitored.
- [ ] Monitor +standup and +todo tags (Should be configurable)
- [ ] Write to a gdoc and a gist (configurable which one)
  - Should support both of these -- for google docs will need auth access and for gist
  - It is a different doc or gist for each tag e.g. +standup goes to different doc than +todo)
- [ ] Handle error conditions
- [ ] Tests (may need to mock)
  - [ ] CI (bonus)
- [ ] Basic README
  - [ ] Deployment instructions e.g. heroku

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
    "+standup"
  }
}
```

Match tag at start, middle or end of a message:

```
+todo ...
...  +todo ...

... +todo
```

Output in doc:

```
yyyy-mm-ddTHH:MM {message} [from:@{username}]

```

Messages should be separated by a blank line

```
yyyy-mm-ddTHH:MM {message}

yyyy-mm-ddTHH:mm {}
```

For standup doc (dates should be in reverse order - i.e. most recent item first):

```
### yyyy-mm-dd - @{username}

{message}

### yyyy-mm-dd - @{username2}

{message}
```

# How to run
For running this one you need to do few really quick steps:

__Google Sheets__
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
6. Copy content of JSON key file in to config.json

__Gitter__
1. Open [gitter dev site](https://developer.gitter.im/docs/welcome)
2. Click Sign in and authorize
3. You will be redirected in private area where you can find your API key, COPY IT!

__Hubot and Heroku__
1. In *Procfile* you need to specify launch code for heroku
```
HUBOT_GITTER2_TOKEN=<APIKEY which you get in previous step> bin/hubot -a gitter2 --name <name of your bot>
```
2. Also you need to specify workingsheet for google docs:
    * Open or create google document
      * Format your document with next columns: action, timestamp, poster, assignees, message
    * Look at URL and find this one section:
    * https://docs.google.com/spreadsheets/d/**15dxhLpRnc1_weGE2rdfSYx7FpQfakbSXrh93cMRIuwsFow**/edit#gid=0
    * Set it in config file as: ``` "workSheet": "15dxhLpRnc1_weGE2rdfSYx7FpQfakbSXrh93cMRIuwsFow" ```
3. Deploy on heroku
