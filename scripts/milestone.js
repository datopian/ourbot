// eslint-disable-next-line import/no-unassigned-import
require('babel-polyfill')
const Issue = require('../node_modules/github-api/dist/components/Issue.js')
const config = require('../config.json')

// Create milestones all
const createMilestone = (title, myDate, owner, repo) => {
  if (!owner && !repo) {
    config.repos.forEach(repo => {
      const issueObj = new Issue(repo.owner + '/' + repo.repo, {token: process.env.GITHUB_TOKEN})
      const milestoneData = {
        title,
        state: 'open',
        description: '',
        due_on: myDate // eslint-disable-line camelcase
      }
      return issueObj.createMilestone(milestoneData)
    })
  } else {
    const issueObj = new Issue(owner + '/' + repo, {token: process.env.GITHUB_TOKEN})
    const milestoneData = {
      title,
      state: 'open',
      description: '',
      due_on: myDate // eslint-disable-line camelcase
    }
    return issueObj.createMilestone(milestoneData)
  }
}

const closeMilestone = (title, owner, repo) => {
  if (!owner || !repo) {
    config.repos.forEach(repo => {
      const issueObj = new Issue(repo.owner + '/' + repo.repo, {token: process.env.GITHUB_TOKEN})
      issueObj.listMilestones().then(result => {
        for (let i = 0; i < result.data.length; i++) {
          if (result.data[i].title === title) {
            const milestone = result.data[i].number
            const milestoneData = {
              state: 'closed'
            }
            return issueObj.editMilestone(milestone, milestoneData)
          }
          return 'Failed'
        }
      })
    })
  } else {
    const issueObj = new Issue(owner + '/' + repo, {token: process.env.GITHUB_TOKEN})
    issueObj.listMilestones().then(result => {
      for (let i = 0; i < result.data.length; i++) {
        if (result.data[i].title === title) {
          const milestone = result.data[i].number
          const milestoneData = {
            state: 'closed'
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
