let Issue = require('../node_modules/github-api/dist/components/Issue.js')
let config = require('../config.json')

// create issue
let createIssue = (title, body, owner, repo) => {
  let issueObj = new Issue(owner+'/'+repo, {token: process.env.GITHUB_TOKEN})
  let issueData = {
    "title": title,
    "body": body
  }
  return issueObj.createIssue(issueData)
}

module.exports = {
  createIssue
}