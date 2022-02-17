const { graphql } = require('@octokit/graphql')

const mutation = `
mutation createIssue($title: String!, $body: String, $repositoryId: ID!) {
  createIssue(input:{title: $title, body: $body, repositoryId: $repositoryId}) {
    clientMutationId
  }
}`

async function createIssue(body, repositoryId) {
  const graphqlWithAuth = graphql.defaults({
    headers: {
      authorization: `token ${process.env.GH_TOKEN}`
    }
  })

  await graphqlWithAuth(mutation, {
    title: `Changelog - ${new Date().toLocaleDateString()}`,
    body,
    repositoryId
  })
}

module.exports = {
  createIssue
}
