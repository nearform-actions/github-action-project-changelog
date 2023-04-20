![CI](https://github.com/nearform-actions/github-action-project-changelog/actions/workflows/ci.yml/badge.svg)

# github-action-project-changelog

GitHub action to create an issue containing a list of project cards according with the project column name specified.

## Inputs

| input               | required | default | description                              |
|---------------------|----------|---------|------------------------------------------|
| columns             | yes      |         | Project column names separated by comma. |
| project-beta-number | yes      |         | Project beta number.                     |
| organization        | yes      |         | Organization name.                       |
| template            | no       | `"{{title}} {{#if assignees }} by {{assignees}} {{/if}} {{#if number}} in [#{{number}}]({{url}}) {{/if}}"` | Handlebar template to generate markdown. |

## Output
The output of this action is an new issue containing all cards given the project column.

## Settings

You have two ways to configure this action.

### 1) Creating a Github application

You need to create a GitHub application under your organization with the following permissions:

#### Repository Permissions:
- `pull-requests: read`
- `issues: read/write`

#### Organization Permissions
- `members: read`
- `projects: read`

Copy the `Private key` and `App id` from the application created.

Go to your repository and create two secrets:
- `GH_APP_PRIVATE_KEY`
- `GH_APP_ID`

Install the application in your organization. This is necessary to generate the token that grants permissions to perform the actions.

Workflow configured with Github app tokens:
```yaml
name: changelog
on:
  workflow_dispatch:
jobs:
  run:
    runs-on: ubuntu-latest
    permissions:
      contents: write
      organization: read
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version-file: '.nvmrc'
      - name: Generate token
        id: generate_token
        uses: tibdex/github-app-token@v1
        with:
          app_id: ${{ secrets.GH_APP_ID }}
          private_key: ${{ secrets.GH_APP_PRIVATE_KEY }}
      - name: Creating an issue action
        uses: nearform-actions/github-action-project-changelog@v1
        id: changelog
        with:
          columns: #todo, in progress
          organization: #fake organization
          project-beta-number: #1
        env:
          GH_TOKEN: ${{ steps.generate_token.outputs.token }}
```

### 2) Creating a PAT (personal access token)
You can also configure this action by creating a [PAT ](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) with the following permissions:
- `repo: all`
- `admin:org -> read:org`

Create the following secret in your repository
- `GH_CHANGELOG_PAT`

Workflow configured with your PAT:
```yaml
name: changelog
on:
  workflow_dispatch:
jobs:
  run:
    runs-on: ubuntu-latest
    permissions:
      contents: write
      organization: read
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version-file: '.nvmrc'
      - name: Creating an issue action
        uses: nearform-actions/github-action-project-changelog@v1
        id: changelog
        with:
          columns: #todo, in progress
          organization: #fake organization
          project-beta-number: #1
        env:
          GH_TOKEN: ${{ secrets.GH_CHANGELOG_PAT }}
```

## Standard Usage

Configure the workflow:

```yaml
name: changelog
on:
  workflow_dispatch:
jobs:
  run:
    runs-on: ubuntu-latest
    permissions:
      contents: write
      organization: read
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version-file: '.nvmrc'
      - name: Generate token
        id: generate_token
        uses: tibdex/github-app-token@v1
        with:
          app_id: ${{ secrets.GH_APP_ID }}
          private_key: ${{ secrets.GH_APP_PRIVATE_KEY }}
      - name: Creating an issue action
        uses: nearform-actions/github-action-project-changelog@v1
        id: changelog
        with:
          columns: #todo, in progress
          organization: #fake organization
          project-beta-number: #1
        env:
          GH_TOKEN: ${{ steps.generate_token.outputs.token }}
```

You can also specify a `template` input written in [handlebars](https://handlebarsjs.com/) to be used to create a card list in markdown.
The following properties can be used to define a template:
- `url`: issue url or pull request url
- `assignees`: card assignees
- `number`: issue number or pull request number
- `title`: card title

Example:
```yaml
name: changelog
on:
  workflow_dispatch:
jobs:
  run:
    runs-on: ubuntu-latest
    permissions:
      contents: write
      organization: read
    steps:
      ...
      - name: Creating an issue action
        uses: nearform-actions/github-action-project-changelog@v1
        id: changelog
        with:
          columns: #todo, in progress
          organization: #fake organization
          project-beta-number: #1
          template: "{{title}} {{#if assignees }} by {{assignees}} {{/if}} {{#if number}} in [#{{number}}]({{url}}) {{/if}}"
        env:
          GH_TOKEN: ${{ steps.generate_token.outputs.token }}
```

As alternative you can configure the workflow to get all inputs dynamically.

Example to get `columns` dynamically:
```yaml
name: changelog
on:
  workflow_dispatch:
    inputs:
      columns:
        type: string
        description: 'Project beta columns'
        required: true
jobs:
  run:
    runs-on: ubuntu-latest
    permissions:
      contents: write
      organization: read
    steps:
      ...
      - name: Creating an issue action
        uses: nearform-actions/github-action-project-changelog@v1
        id: changelog
        with:
          organization: # organization name
          project-beta-number: #project beta number
          columns: ${{ github.event.inputs.columns }}
        env:
          GH_TOKEN: ${{ steps.generate_token.outputs.token }}
```
