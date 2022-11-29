const core = require("@actions/core");
const github = require("@actions/github");
const fs = require("fs");
const needle = require("needle");

process.env.EMOJI_STATUS_OK = ':thumbsup:';
process.env.EMOJI_STATUS_KO = ':x:';

const loadTemplate = (templatePath) =>
    JSON.parse(fs.readFileSync(templatePath));

const getTemplateEnvs = (str) => {
    const pattern = /\$\{?([A-Z0-9_]+)\}?/gm;
    return str.match(pattern);
};

const trimTemplateEnvs = (envs) =>
    envs.map((env) => env.replace(/\$\{?([A-Z0-9_]+)\}?/, "$1"));

const call_slack_api = (payload) => {
    console.log("Slack Payload=", payload)
    const options = {
        json: true,
        headers: {
            // "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.SLACK_BOT_TOKEN}`
        }
    };
    needle.post("https://slack.com/api/chat.postMessage", payload, options, (error, response) => {
        if (!error) {
            console.log("Slack Response=", response.body);
        } else {
            core.setFailed(error)
        }
    });
}

const processTemplatesMechanism = (channelId, value) => {
    const templateUrl = `https://raw.githubusercontent.com/evryfs/notify-slack-action/templates/templates/${value}`
    needle.get(templateUrl, (error, response) => {
        if (error) {
            core.setFailed("Template not found on evryfs/notify-slack-action")
        } else {
            core.info(`Download template from evryfs/notify-slack-action -- ${response.statusMessage}`)
            let template = JSON.parse(response.body)
            let blocks = JSON.stringify(template.blocks);
            let templateEnvs = getTemplateEnvs(blocks);
            let envs = trimTemplateEnvs(templateEnvs);
            templateEnvs.forEach((tEnv, i) => {
                console.log("DEBUG:", tEnv, "=", process.env[envs[i]])
                blocks = blocks.replaceAll(tEnv, process.env[envs[i]]);
            });
            console.log("Blocks=", blocks);
            call_slack_api({ channel: channelId, blocks: blocks })
        }
    });
}

const processTextMechanism = (channelId, value) => {
    call_slack_api({ channel: channelId, text: value})
}

const processBlocksMechanism = (channelId, value) => {
    call_slack_api({ channel: channelId, blocks: value})
}

const main = async () => {
    try {
        console.log("::Main Program::");
        const channelId = core.getInput("channel-id");
        const mechanism = core.getInput("mechanism");
        const value = core.getInput("value");
        switch (mechanism) {
            case "blocks":
                processBlocksMechanism(channelId,value)
                break
            case "text":
                processTextMechanism(channelId,value)
                break
            case "templates":
                processTemplatesMechanism(channelId,value)
                break
            default:
                core.setFailed(`Unknown mechanism '${mechanism}'`)
        }
    } catch (err) {
        core.setFailed(err.message);
    }
};

main();
