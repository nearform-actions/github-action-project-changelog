const filterByColumn = (cards = [], columnId = '') => {
  const cardsFiltered = cards.filter(({ node }) =>
    node.fieldValues.nodes.some(item => columnId === item.value)
  )

  return cardsFiltered
}

module.exports = {
  filterByColumn
}
