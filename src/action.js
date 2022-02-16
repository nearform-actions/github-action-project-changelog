'use strict'
const core = require('@actions/core')
const github = require('@actions/github')

const { createIssue } = require('./create-issue')
const { filterByColumnId, findColumnIdByName } = require('./filters')
const { formatCards, generateMarkdown } = require('./markdown')
const { getProjectBetaCards, getProjectSettings } = require('./project-cards')

const run = async () => {
  core.info(`*** ACTION RUN - START ***`)

  try {
    const columnName = core.getInput('column')
    const template = core.getInput('template')
    const organization = core.getInput('organization')
    const projectNumber = Number(core.getInput('project-beta-number'))

    const {
      payload: {
        repository: { node_id: repositoryId }
      }
    } = github.context

    const cards = await getProjectBetaCards(organization, projectNumber)()
    const projectSettings = await getProjectSettings(
      organization,
      projectNumber
    )
    const columnId = findColumnIdByName(columnName, projectSettings)

    if (!columnId) {
      throw new Error('columnId not found.')
    }

    const cardsFilteredByColumn = filterByColumnId(cards, columnId)
    const fCards = formatCards(cardsFilteredByColumn, template)
    const markdown = generateMarkdown(fCards)

    await createIssue(markdown, repositoryId)
  } catch (err) {
    core.setFailed(err.toString())
  } finally {
    core.info(`
    *** ACTION RUN - END ***
    `)
  }
}

module.exports = {
  run
}
