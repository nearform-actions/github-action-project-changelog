const json2md = require('json2md')
const Handlebars = require('handlebars')

const generateMarkdown = cards => {
  const markdownOptions = [
    { h1: "What's Changed" },
    {
      ul: cards
    }
  ]

  const markdown = json2md(markdownOptions)

  return markdown
}

const getCardAssignees = node => {
  const issueAssignee = node?.content?.assignees?.nodes
    ?.map(({ login }) => `@${login}`)
    ?.join(', ')

  if (!issueAssignee) {
    // board card assignee
    return node?.fieldValues?.nodes?.find(
      ({ projectField: { name } }) => name === '@Assignee'
    )?.value
  }

  return issueAssignee
}

const formatCards = (cards = [], template = '') => {
  const hTemplate = Handlebars.compile(template)

  return cards.map(({ node }) =>
    hTemplate({
      ...node.content,
      title: node?.title,
      assignees: getCardAssignees(node)
    })
  )
}

module.exports = {
  formatCards,
  generateMarkdown
}
