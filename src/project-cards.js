const { graphql } = require('@octokit/graphql')

const query = `
query projectCards($organization: String!, $cursor: String, $projectNumber: Int!) {
  organization(login: $organization) {
    projectNext(number: $projectNumber) {
      url
      items(first: 100, after: $cursor) {
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          cursor
          node {
            title
            content {
              ... on Issue {
                state
                closed
                number
                url
                assignees(first: 20){
                  nodes{
                    login
                  }
                }
              }
              ... on PullRequest {
                state
                url
                number
                assignees(first: 20){
                  nodes{
                    login
                  }
                }
              }
            }
            fieldValues(first: 20) {
              nodes {
                value
                projectField {
                  name
                }
              }
            }
          }
        }
      }
    }
  }
}`

const getProjectBetaCards =
  (organization, projectNumber) =>
  async ({ results, cursor } = { results: [] }) => {
    const graphqlWithAuth = graphql.defaults({
      headers: {
        authorization: `token ${process.env.GH_TOKEN}`
      }
    })

    const {
      organization: {
        projectNext: {
          items: {
            edges,
            pageInfo: { hasNextPage, endCursor }
          }
        }
      }
    } = await graphqlWithAuth(query, {
      cursor,
      organization,
      projectNumber
    })

    results.push(...edges)

    if (hasNextPage) {
      await getProjectBetaCards(
        organization,
        projectNumber
      )({
        results,
        cursor: endCursor
      })
    }

    return results
  }

module.exports = {
  getProjectBetaCards
}
