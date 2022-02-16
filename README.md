# github-action-project-changelog

GitHub action to create an issue containing a list of project cards according with the project column name specified.

## Settings

You need to create a GitHub application under your organization with the following permissions:

##### Repository Permissions:
- Pull Requests (Read)
- Issues (Read/Write)

##### Organization Permissions
- Members (Read)
- Projects (Read)

Copy the `Private key` and `App id` from the application created.

Go to your repository and create two secrets:
- `GH_APP_PRIVATE_KEY` 
- `GH_APP_ID`

Install the application in your organization.

This is necessary to generate the token that grants permissions to perform the actions.

## Input

See [action.yml](action.yml).

## Standard Usage

Configure a workflow to run

```yaml
name: changelog
on:
  workflow_dispatch:
jobs:
  run:
    runs-on: ubuntu-latest
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
        uses: nearform/github-action-project-changelog@v1
        id: changelog
        with:
          columns: #todo, in progress
          organization: #fake organization
          project-beta-number: #1
        env:
          GH_TOKEN: ${{ steps.generate_token.outputs.token }}
```

When the workflow finishes, it will be created an issue under the project containing all cards given the project column.

You can also specify a `template` written in [handlebars](https://handlebarsjs.com/) as input to be used to create a card list in markdown.
The following properties can be used to define a template:
- url: issue url or pull request url
- assignees: card assignees
- number: issue number or pull request number
- title: card title

Example:
```yaml
name: changelog
on:
  workflow_dispatch:
jobs:
  run:
    runs-on: ubuntu-latest
    steps:
      ...
      - name: Creating an issue action
        uses: nearform/github-action-project-changelog@v1
        id: changelog
        with:
          columns: #todo, in progress
          organization: #fake organization
          project-beta-number: #1
          template: "{{title}} {{#if assignees }} by {{assignees}} {{/if}} {{#if number}} in [#{{number}}]({{url}}) {{/if}}" 
        env:
          GH_TOKEN: ${{ steps.generate_token.outputs.token }}
```

As alternative you can specify the workflow to get the column dinamically.

Example:
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
    steps:
      ...
      - name: Creating an issue action
        uses: nearform/github-action-project-changelog@v1
        id: changelog
        with:
          organization: # organization name
          project-beta-number: #project beta number
          columns: ${{ github.event.inputs.columns }}
        env:
          GH_TOKEN: ${{ steps.generate_token.outputs.token }}
```



