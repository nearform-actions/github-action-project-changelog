'use strict'

const { test } = require('tap')

test('Creating issues', async ({ equal, plan, mock }) => {
  plan(2)
  const markdown = 'fake-title-1 by @fake-login in [#5](fake-url-1)'
  const muduleToTest = mock('../src/create-issue', {
    '@octokit/graphql': {
      graphql: {
        defaults: () => {
          return async (_, params) => {
            equal(params.repositoryId, 'R_kgDOGyDrvw')
            equal(params.body, markdown)
            return {
              issue: {
                id: 'fale-issue-id'
              }
            }
          }
        }
      }
    }
  })

  await muduleToTest.createIssue(markdown)
})
