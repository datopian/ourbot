let Issue = require('../node_modules/github-api/dist/components/Issue.js')
let config = require('../config.json')

// create milestones all
let createMilestone = (title, myDate, owner, repo) => {
  if (!owner || !repo) {
    config.repos.forEach(repo => {
      let issueObj = new Issue(repo.owner+'/'+repo.repo, {token: process.env.GITHUB_TOKEN})
      let milestoneData = {
        "title": title,
        "state": "open",
        "description": "",
        "due_on": myDate
      }
      return issueObj.createMilestone(milestoneData)
    })
  }
  else {
    let issueObj = new Issue(owner+'/'+repo, {token: process.env.GITHUB_TOKEN})
    let milestoneData = {
      "title": title,
      "state": "open",
      "description": "",
      "due_on": myDate
    }
    return issueObj.createMilestone(milestoneData)
  }
}

let closeMilestone = (title, owner, repo) => {
  if (!owner || !repo) {
    config.repos.forEach(repo => {
      let issueObj = new Issue(repo.owner+'/'+repo.repo, {token: process.env.GITHUB_TOKEN})
      issueObj.listMilestones().then(function(result) {
        for (let i = 0; i < result.data.length; i++) {
          if(result.data[i].title === title) {
            let milestone = result.data[i].number
            let milestoneData = {
              "state": "closed",
            }
            return issueObj.editMilestone(milestone, milestoneData)
          }
          else {
            return "Failed"
          }
        }
      })
    })
  }
  else {
    let issueObj = new Issue(owner+'/'+repo, {token: process.env.GITHUB_TOKEN})
    issueObj.listMilestones().then(function(result) {
      for (let i = 0; i < result.data.length; i++) {
        if(result.data[i].title === title) {
          let milestone = result.data[i].number
          let milestoneData = {
            "state": "closed",
          }
          return issueObj.editMilestone(milestone, milestoneData)
        }  
      }
    })
  }
}


module.exports = {
  createMilestone,
  closeMilestone
}