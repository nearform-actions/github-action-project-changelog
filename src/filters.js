const filterByColumnId = (cards = [], columnId = '') => {
  const cardsFiltered = cards.filter(({ node }) =>
    node.fieldValues.nodes.some(item => columnId === item.value)
  )

  return cardsFiltered
}

const findColumnIdByName = (columnName, projectSettings) => {
  const statusSetting = projectSettings?.find(({ name }) =>
    /status/i.test(name)
  )

  if (statusSetting) {
    const column = JSON.parse(statusSetting?.settings)?.options?.find(
      ({ name }) =>
        columnName?.trim()?.toLowerCase()?.includes(name?.trim().toLowerCase())
    )

    return column?.id
  }
}

module.exports = {
  filterByColumnId,
  findColumnIdByName
}
