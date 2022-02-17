'use strict'
const core = require('@actions/core')
const github = require('@actions/github')

const { createIssue } = require('./create-issue')
const { filterByColumnIds, findColumnIdByName } = require('./filters')
const { formatCards, generateMarkdown } = require('./markdown')
const { getProjectBetaCards, getProjectSettings } = require('./project-cards')

const run = async () => {
  core.info(`*** ACTION RUN - START ***`)

  try {
    const columnNames = core.getInput('columns')
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
    const columnIds = findColumnIdByName(columnNames, projectSettings)

    if (!columnIds) {
      throw new Error('column Id not found.')
    }

    const cardsFilteredByColumns = filterByColumnIds(cards, columnIds)
    const fCards = formatCards(cardsFilteredByColumns, template)
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
