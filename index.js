const { getInput, setFailed, info } = require("@actions/core");
const notifySlack = require("./src/notify");

const main = async () => {
    info("\u001b[32;1m::Notify Slack Action::\u001b[0m");
    try {
        const channelId = getInput("channel-id");
        const mechanism = getInput("mechanism");
        const value = getInput("value");
        notifySlack[mechanism](channelId, value);
    } catch (error) {
        setFailed(`FAILED on inputs: ${error}`);
    }
};

main();
