const core = require("@actions/core");
const notifySlack = require("./src/notify");

const main = async () => {
  try {
    console.log("::Notify Slack Action::");
    const channelId = core.getInput("channel-id");
    const mechanism = core.getInput("mechanism");
    const value = core.getInput("value");
    notifySlack[mechanism](channelId, value);
  } catch (err) {
    core.setFailed(`Error: ${err}`);
  }
};

main();
