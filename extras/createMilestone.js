// npm install github-api
let Issue = require('./node_modules/github-api/dist/components/Issue.js')

// create Milestones
let repos = [
  {owner: 'datahq', repo: 'docs'},
  {owner: 'datahq', repo: 'datahub-cli'},
  {owner: 'datahq', repo: 'frontend'},
  {owner: 'datahq', repo: 'auth'},
  {owner: 'datahq', repo: 'datapackage-pipelines-datahub'},
  {owner: 'datahq', repo: 'bitstore'},
  {owner: 'datahq', repo: 'deploy'},
  {owner: 'datahq', repo: 'metastore'},
  {owner: 'datahq', repo: 'assembler'},
  {owner: 'datahq', repo: 'pm'},
  {owner: 'datahq', repo: 'specstore'},
  {owner: 'datahq', repo: 'core-datasets-tools'},
  {owner: 'frictionlessdata', repo: 'datapackage-render-js'},
  {owner: 'frictionlessdata', repo: 'dpr-js'}
]
repos.forEach(repo => {
  let issueObj = new Issue(repo.owner+'/'+repo.repo, {token: ''})
  let milestoneData = {
    "title": "Sprint - 14 Aug 2017",
    "state": "open",
    "description": "",
    "due_on": "2017-08-15T00:00:00Z"
  }
  issueObj.createMilestone(milestoneData)
})