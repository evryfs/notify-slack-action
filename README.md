# Notify Slack's channel by posting messages

_Forked from [abinoda/slack-action](https://github.com/abinoda/slack-action)_

This action wraps the Slack [chat.postMessage](https://api.slack.com/methods/chat.postMessage) API method for posting to channels, private groups, and DMs. This action sends messages using [Slack bot tokens](https://api.slack.com/docs/token-types), which have two main advantages compared to user tokens and incoming webhooks: (1) Bots can't be disabled inadvertently when a Slack user is disabled or removed. Slack has written about this in a [recent announcement](https://medium.com/slack-developer-blog/the-latest-with-app-tokens-fe878d44130c), and (2) Bots offer a [powerful range of capabilities](https://api.slack.com/bot-users) that can be leveraged to perform more functions.

**Note**: To use this GitHub Action you'll first need to create a Slack App and install it to your Slack workspace.

## Usage

```yaml
- name: Notify Slack
  env:
    SLACK_BOT_TOKEN: ${{ secrets.SLACK_BOT_TOKEN }} # required
  uses: rainui28/notify-slack-action@<tag>
  with:
    channel-id: <slack-channel-id> # required
    text: <text-to-post> # required
```

Here's what the Slack message would look like:

<img src="docs/images/slack-message-example.png" width="540">

### Parameters

| **Parameter**   | **Required** | **Type** | **Description**                      |
| --------------- | ------------ | -------- | ------------------------------------ |
| SLACK_BOT_TOKEN | x            | secret   | Slack bot token auth                 |
| channel-id      | x            | string   | Channel where message will be posted |
| text            | x            | string   | Message to post in the channel       |

**You can find available action's tags [here](https://github.com/rainui28/notify-slack-action/tags)**

## References

- [Slack's documentation](https://api.slack.com/docs/messages)
- [Slack's API Bot](https://api.slack.com/authentication/basics)
- [Slack chat.postMessage](https://api.slack.com/methods/chat.postMessage)

**Note**: A "channel ID" can be the ID of a channel, private group, or user you would like to post a message to. Your bot can message any user in your Slack workspace but needs to be invited into channels and private groups before it can post to them.

- **Slack App**: Right click on channel > View channel details > Channel ID (at the bottom)
- **Slack Webapp**: channel IDs at the end of the URL when viewing channels and private groups. Note that this doesn't work for direct messages. `https://myworkspace.slack.com/messages/CHANNEL_ID/`

You can also find channel IDs using the Slack API. Get a list of channels that your bot is a member of via Slack's [users.conversations](https://api.slack.com/methods/users.conversations) endpoint. Get user IDs for direct messages using Slack's [users.lookupByEmail](https://api.slack.com/methods/users.lookupByEmail) endpoint

## License

The Dockerfile and associated scripts and documentation in this project are released under the [MIT License](LICENSE).
