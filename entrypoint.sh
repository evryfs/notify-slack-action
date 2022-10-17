#!/bin/sh

##
# Log error message
# Args:
#   $1: [Required] error message to log
##
log_error() {
  echo $1
  exit 1
}

##
# Pre-requisites
##
if [ -z "$SLACK_BOT_TOKEN" ]; then
  log_error "Set the SLACK_BOT_TOKEN secret."
fi

if [ -z $1 ]; then
  log_error "Missing required Slack channel id needed to post the text message."
fi

if [ -z $2 ]; then
  log_error "Missing required text message to post on Slack."
fi

##
# Main program
##
payload='{"channel": "'$1'", "text": "'$2'"}'
echo "* Preparing payload: $payload"
response=`curl -X POST \
  -H "Content-type: application/json" \
  -H "Authorization: Bearer $SLACK_BOT_TOKEN" \
  -d "$payload" \
  https://slack.com/api/chat.postMessage`
is_ok=`echo $response | jq '.ok'`
if [ $is_ok == 'true' ]
then 
  echo "* Slack channel id '$1' has been notified with '$2'"
else
  log_error "SLACK_BOT_ERROR: `echo $response | jq '.error'`"
fi
exit 0
