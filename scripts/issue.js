// eslint-disable-next-line import/no-unassigned-import
require('babel-polyfill')
const Issue = require('../node_modules/github-api/dist/components/Issue.js')

// Create issue
const createIssue = (title, body, owner, repo, milestone) => {
  const issueObj = new Issue(owner + '/' + repo, {token: process.env.GITHUB_TOKEN})
  const issueData = {
    title,
    body,
    milestone
  }
  return issueObj.createIssue(issueData)
}

module.exports = {
  createIssue
}
