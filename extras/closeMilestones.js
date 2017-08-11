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
  {owner: 'frictionlessdata', repo: 'dpr-js'},
  {owner: 'datahq', repo: 'data.js'}
]
repos.forEach(repo => {
  let issueObj = new Issue(repo.owner+'/'+repo.repo, {token: ''})
  issueObj.listMilestones().then(function(result) {
    for (i = 0; i < result.data.length; i++) {
      if(result.data[i].title === 'Sprint - 31 Jul 2017') {
        let milestone = result.data[i].number
        let milestoneData = {
          "state": "closed",
        }
        issueObj.editMilestone(milestone, milestoneData)
      }  
    }
  })
})