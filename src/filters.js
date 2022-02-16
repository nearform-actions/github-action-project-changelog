const filterByColumnIds = (cards = [], columnIds = []) => {
  console.log({
    columnIds
  })
  const cardsFiltered = cards.filter(({ node }) =>
    node.fieldValues.nodes.some(item => columnIds?.some(c => c === item.value))
  )

  return cardsFiltered
}

const findColumnIdByName = (columnNames, projectSettings) => {
  const statusSetting = projectSettings?.find(({ name }) =>
    /status/i.test(name)
  )

  if (statusSetting) {
    const columns = columnNames?.split(',')

    const columnSettings = JSON.parse(statusSetting?.settings)?.options?.filter(
      ({ name }) =>
        columns?.find(c => c?.trim()?.includes(name?.trim()?.toLowerCase()))
    )

    return columnSettings?.map(c => c?.id)
  }
}

module.exports = {
  filterByColumnIds,
  findColumnIdByName
}
