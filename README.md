# :zap: Notify Slack Action: How-to create a template

**Last update: 2022-12-02**

## 1. Fork this repository

After forking this repository, create a new branch from `templates` branch that follows this naming convention `templates/<template-name>`

```shell
git checkout -b templates/my_template templates
```

## 2. Create your JSON template file

A template **must be** a JSON file. 

```
my_template.json
```

Indeed, the template contains the payload expected by the Slack API when sending a postMessage. In addition, a template must contains a `blocks` payload that complies with [Slack Block Kit](https://api.slack.com/block-kit).

You can also take a look at [gh_dashboard_simple.json](./templates/gh_dashboard_simple.json) as a model for your template.

## 3. Document your template in [docs/](./docs/)

You can copy/paste [](./GUIDELINE_EXAMPLE.md) into [docs/](./docs/) and rename it with your template filename. Update the information as describe in the guideline example. 

You can also take a look at [gh_dashboard_simple.md](./docs/gh_dashboard_simple.md) as a model for your guideline.

## 4. Submit your template with a Pull Request

Create a pull request from your repository to `evryfs/notify-slack-action`. The code owners will take a look at your template and approve it if everything is fine.
