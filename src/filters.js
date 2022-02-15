const { columnsId } = require('./constants')

const filterByColumn = (cards = [], columnToFilter = '') => {
  let cFilter = columnsId[columnToFilter]
    ? [columnsId[columnToFilter]]
    : Object.keys(columnsId).map(key => columnsId[key])

  const cardsFiltered = cards.filter(({ node }) =>
    node.fieldValues.nodes.some(item => cFilter.some(c => c === item.value))
  )

  return cardsFiltered
}

module.exports = {
  filterByColumn
}
