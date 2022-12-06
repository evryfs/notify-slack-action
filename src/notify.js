const core = require("@actions/core");
const needle = require("needle");

const getTemplateEnvs = (str) => str.match(/\$\{?([A-Z0-9_]+)\}?/gm);

const trimTemplateEnvs = (envs) => envs.map((env) => env.replace(/\$\{?([A-Z0-9_]+)\}?/, "$1"));

const call_slack_api = (payload) => {
    const options = {
        json: true,
        headers: {
            Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}`
        }
    };
    needle.post("https://slack.com/api/chat.postMessage", payload, options, (error, response) => {
        if (error) {
            core.setFailed(error);
        } else {
            core.startGroup("Slack API response");
            core.info(JSON.stringify(response.body, null, 2));
            if (response.body.ok)
                core.info(
                    `\u001b[32;1mNotification has been delivered in channel ${response.body.channel}\u001b[0m`
                );
            else core.setFailed(response.body.error);
            core.endGroup();
        }
    });
};

const processTemplatesMechanism = (channelId, value) => {
    const templateUrl = `https://raw.githubusercontent.com/evryfs/notify-slack-action/templates/templates/${value}`;
    needle.get(templateUrl, (error, response) => {
        if (error) {
            core.setFailed("Template not found on evryfs/notify-slack-action");
        } else {
            const templateMsgStatus = `Download template '${value}' from evryfs/notify-slack-action -- ${response.statusMessage}`;
            if (response.statusCode.toString().startsWith(4)) {
                core.setFailed(templateMsgStatus);
            } else {
                core.info(templateMsgStatus);
                let template = JSON.parse(response.body);
                let blocks = JSON.stringify(template.blocks);
                let templateEnvs = getTemplateEnvs(blocks);
                let envs = trimTemplateEnvs(templateEnvs);
                templateEnvs.forEach((tEnv, i) => {
                    blocks = blocks.replaceAll(tEnv, process.env[envs[i]]);
                });
                call_slack_api({ channel: channelId, blocks: blocks });
            }
        }
    });
};

const processTextMechanism = (channelId, value) => {
    call_slack_api({ channel: channelId, text: value });
};

const processBlocksMechanism = (channelId, value) => {
    call_slack_api({ channel: channelId, blocks: value });
};

module.exports = {
    blocks: processBlocksMechanism,
    templates: processTemplatesMechanism,
    text: processTextMechanism
};
