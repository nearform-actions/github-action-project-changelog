'use strict'
const core = require('@actions/core')
import * as github from '@actions/github'

const { createIssue } = require('./create-issue')
const { filterByColumn } = require('./filters')
const { formatCards, saveMarkdown } = require('./markdown')
const { getProjectBetaCards } = require('./project-cards')

const run = async () => {
  core.info(`*** ACTION RUN - START ***`)

  try {
    const column = core.getInput('column-id')
    const template = core.getInput('template')
    const organization = core.getInput('organization')
    const projectNumber = core.getInput('project-beta-number')

    const { payload } = github.context
    const {
      repository: { node_id: repositoryId }
    } = payload

    const cards = await getProjectBetaCards(
      organization,
      Number(projectNumber)
    )()
    const cardsFilteredByColumn = filterByColumn(cards, column)
    const fCards = formatCards(cardsFilteredByColumn, template)
    const markdown = saveMarkdown(fCards)

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
