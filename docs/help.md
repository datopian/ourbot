### Commands

`bot create|close milestone all "title"` - Creates milestone for all repos listed in `config.json`
`bot create|close milestone "title" in "myorg/myrepo"` - Create and close milestone in the specific github repo
  - *title* - can accept the following values:
    - any date in the format of `DD MMM YYYY`
    - any string
    For example: "13 Jan 2017" or "This is Backlog"

`bot integrities` - Return Google SpreadSheet url for tag `+integrity`    
`bot issue "title" about "body" in "myorg/myrepo"` - Create an issue on github
  - *title* - the title of the issue
  - *body* - the contents of the issue
  
`bot issue "title" in "myorg/myrepo"` - Create an issue without content on github
  - *title* - the title of the issue
    
`bot links` - Return Google SpreadSheet url for tag `+link`
`bot map me <query>` - Returns a map view of the area returned by query.
`bot promises` - Return Google SpreadSheet url for tag `+promise`
`bot standups` - Return Google SpreadSheet  url for tag `+standup`
`bot the rules` - Make sure hubot still knows the rules.
`bot todos` - Return Google SpreadSheet  url for tag `+todo`
`bot time in <place>` - Reply with current time in requested place
`ship it` - Display a motivation squirrel
`!thank user` - Motivate user 

### Tags
In your chat channel tag at start, middle or end of a message: `+todo`, `+link`, `+standup`, `+promise`, `+integrity`