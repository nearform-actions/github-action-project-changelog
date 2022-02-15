const { columnsId } = require('./constants')

const filterByIssuesClosed = (cards = []) => {
  const cardsWithIssuesClosed = cards.filter(({ node: { content } }) => {
    const state = content?.state?.toLowerCase()
    return content?.closed || state === 'closed' || state === 'merged'
  })

  return cardsWithIssuesClosed
}

const filterByColumn = ({ cards = [], columnToFilter }) => {
  let cFilter = columnsId[columnToFilter]
    ? [columnsId[columnToFilter]]
    : Object.keys(columnsId).map(key => columnsId[key])

  const cardsFiltered = cards.filter(({ node }) =>
    node.fieldValues.nodes.some(item => cFilter.some(c => c === item.value))
  )

  return cardsFiltered
}

module.exports = {
  filterByColumn,
  filterByIssuesClosed
}
