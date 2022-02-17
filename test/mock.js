const PROJECT_CARDS_MOCK = {
  organization: {
    projectNext: {
      url: 'fake-url',
      items: {
        pageInfo: {
          hasNextPage: true,
          endCursor: 'fake-cursor'
        },
        edges: [
          {
            cursor: 'fake-cursor',
            node: {
              title: 'fake-title',
              content: null,
              fieldValues: {
                nodes: [
                  {
                    value: 'fake-title',
                    projectField: {
                      name: 'Title',
                      updatedAt: '2022-01-10T09:32:48Z'
                    }
                  },
                  {
                    value: 'fake-status-id',
                    projectField: {
                      name: 'Status',
                      updatedAt: '2022-01-23T17:15:52Z'
                    }
                  }
                ]
              }
            }
          }
        ]
      }
    }
  }
}

module.exports = PROJECT_CARDS_MOCK
