'use strict'
const { test } = require('tap')

const { filterByColumn } = require('../src/filters')
const { formatCards } = require('../src/markdown')
const mockData = require('./mock')

const addCards = (cards = []) => {
  return {
    ...mockData,
    organization: {
      ...mockData.organization,
      projectNext: {
        ...mockData.organization.projectNext,
        items: {
          ...mockData.organization.projectNext.items,
          edges: [...mockData.organization.projectNext.items.edges, ...cards]
        }
      }
    }
  }
}

test('should filter cards by done status', t => {
  t.plan(2)
  const card = {
    node: {
      content: null,
      fieldValues: {
        nodes: [
          {
            value: '98236657', // done status id
            projectField: {
              name: 'Status'
            }
          }
        ]
      }
    }
  }

  const organizationCards = addCards([card])
  const cards = organizationCards.organization.projectNext.items.edges
  const doneCards = filterByColumn(cards, 'done')

  t.equal(doneCards.length, 1)
  t.equal(doneCards[0].node.fieldValues.nodes[0].value, '98236657')
})

test('should not filter cards by done status when the its status id is different', t => {
  t.plan(1)
  const card = {
    node: {
      content: null,
      fieldValues: {
        nodes: [
          {
            value: 'another-status-id',
            projectField: {
              name: 'Status'
            }
          }
        ]
      }
    }
  }

  const organizationCards = addCards([card])
  const doneCards = filterByColumn(
    organizationCards.organization.projectNext.items.edges,
    'done'
  )

  t.equal(doneCards.length, 0)
})

test('should filter by all columns when selected all', t => {
  t.plan(1)
  const card = {
    node: {
      content: null,
      fieldValues: {
        nodes: [
          {
            value: '50274f36', // internal
            projectField: {
              name: 'Status'
            }
          }
        ]
      }
    }
  }

  const card2 = {
    node: {
      content: null,
      fieldValues: {
        nodes: [
          {
            value: 'f75ad846', //to do
            projectField: {
              name: 'Status'
            }
          }
        ]
      }
    }
  }

  const organizationCards = addCards([card, card2])
  const cards = filterByColumn(
    organizationCards.organization.projectNext.items.edges,
    'all'
  )

  t.equal(cards.length, 2)
})

test('should return empty cards when there is no cards to filter', t => {
  t.plan(1)
  const cards = filterByColumn()

  t.equal(cards.length, 0)
})

test('should format cards in markdown style using handlebar template', t => {
  t.plan(1)

  const organizationCards = addCards([
    {
      node: {
        title: 'fake-title-1',
        content: {
          url: 'fake-url-1',
          updatedAt: new Date('01-01-2022 12:00:00 AM'),
          closed: true,
          number: 5,
          assignees: {
            nodes: [
              {
                login: 'fake-login'
              }
            ]
          }
        }
      }
    },
    {
      node: {
        title: 'fake-title-2',
        content: {
          url: 'fake-url-2',
          updatedAt: new Date('01-01-2022 12:00:00 AM'),
          state: 'MERGED',
          number: 7,
          assignees: {
            nodes: [
              {
                login: 'fake-login-2'
              }
            ]
          }
        }
      }
    },
    {
      node: {
        title: 'fake-title-3',
        content: {
          url: 'fake-url-3',
          updatedAt: new Date('01-01-2022 12:00:00 AM'),
          state: 'MERGED',
          number: 15,
          assignees: {
            nodes: [
              {
                login: 'fake-login-3'
              }
            ]
          }
        }
      }
    }
  ])

  const fCards = formatCards(
    organizationCards.organization.projectNext.items.edges,
    '{{title}} {{url}}'
  )

  t.match(fCards, [
    'fake-title ',
    'fake-title-1 fake-url-1',
    'fake-title-2 fake-url-2',
    'fake-title-3 fake-url-3'
  ])
})

test('should return empty when there is no cards to format', t => {
  t.plan(1)

  const fCards = formatCards()

  t.equal(fCards.length, 0)
})

test('should call json2md with cards formated in markdown', t => {
  t.plan(2)
  const cards = [
    '**fake-title** [draft] ',
    '**[fake-title-1](fake-url-1)** [draft] updated at *1/1/2022, 12:00:00*',
    '**[fake-title-2](fake-url-2)** [merged] updated at *1/1/2022, 12:00:00*'
  ]

  const myModule = t.mock('../src/markdown', {
    json2md: input => {
      t.match(input, [
        { h1: "What's Changed" },
        {
          ul: cards
        }
      ])
    },
    fs: {
      existsSync: () => true,
      mkdirSync: () => t.fail(),
      writeFileSync: () => t.pass()
    }
  })

  myModule.saveMarkdown(cards)
})

test("should create folder to save changelogs if it doesn't exist", t => {
  t.plan(2)
  const cardsDoneMarkDown = ['**fake-title** [draft] ']

  const myModule = t.mock('../src/markdown', {
    fs: {
      existsSync: () => false,
      mkdirSync: () => t.pass(),
      writeFileSync: () => t.pass()
    }
  })

  myModule.saveMarkdown(cardsDoneMarkDown)
})
