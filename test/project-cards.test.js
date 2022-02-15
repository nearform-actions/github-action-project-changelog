'use strict'

const tap = require('tap')

tap.test('Loading cards (no pagination)', async t => {
  const expectedResults = [
    { some: 'data 1' },
    { some: 'data 2' },
    { some: 'data 3' },
    { some: 'data 4' }
  ]
  const muduleToTest = t.mock('../src/project-cards', {
    '@octokit/graphql': {
      graphql: {
        defaults: () => {
          return async () => ({
            organization: {
              projectNext: {
                items: {
                  edges: expectedResults,
                  pageInfo: { hasNextPage: false, endCursor: null }
                }
              }
            }
          })
        }
      }
    }
  })

  const result = await muduleToTest.getProjectBetaCards()
  t.same(result, expectedResults, 'edges are returned correctly')
})

tap.test('Loading cards (with pagination)', async t => {
  const expectedResults1 = [
    { some: 'data 1' },
    { some: 'data 2' },
    { some: 'data 3' },
    { some: 'data 4' }
  ]
  const expectedResults2 = [{ some: 'data 5' }, { some: 'data 6' }]
  const expectedResults3 = [{ some: 'data 7' }, { some: 'data 8' }]
  const expected = [expectedResults1, expectedResults2, expectedResults3]

  let timesCalled = 0

  const muduleToTest = t.mock('../src/project-cards', {
    '@octokit/graphql': {
      graphql: {
        defaults: () => {
          return async () => {
            const results = {
              organization: {
                projectNext: {
                  items: {
                    edges: expected[timesCalled],
                    pageInfo: {
                      hasNextPage: timesCalled !== 2,
                      endCursor: '12345'
                    }
                  }
                }
              }
            }

            timesCalled++

            return results
          }
        }
      }
    }
  })

  const result = await muduleToTest.getProjectBetaCards()
  t.same(
    result,
    [...expectedResults1, ...expectedResults2, ...expectedResults3],
    '3 calls to the api return the correct edges'
  )
})
