#!/bin/sh

##  Send payload to Slack API postMessage endpoint
##  allowing to post a message into a Slack channel
##
##  Args: related to action.yml args
##    $1: channel-id 
##    $2: value
##    $3: mechanism
##

##
# Log error message
# Args:
#   $1: [Required] error message to log
##
log_error() {
  echo "ERROR: $1"
  exit 1
}

log_info() {
  echo "INFO: $1"
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

# if [ -z $2 ]; then
#   log_error "Missing required value to post on Slack."
# fi

if [ -z $3 ]; then
  log_error "Missing required mechanism to use in order to post on Slack."
fi

ACTION_CHANNEL_ID=$1
ACTION_VALUE=$2
ACTION_MECHANISM=$3

##
## Functions
##
send_payload_slack_api(){
  echo "* Preparing payload: $payload"
  response=`curl -X POST \
    -H "Content-type: application/json" \
    -H "Authorization: Bearer $SLACK_BOT_TOKEN" \
    -d "$payload" \
    https://slack.com/api/chat.postMessage`
  is_ok=`echo $response | jq '.ok'`
  if [ $is_ok == 'true' ]
  then 
    echo "* Slack channel id '$ACTION_CHANNEL_ID' has been notified"
  else
    log_error "SLACK_BOT_ERROR: `echo $response | jq '.error'`"
  fi
}

build_payload_text(){
  log_info "Processing 'text' case"
  payload=`jq -n --arg ch "$ACTION_CHANNEL_ID" --arg value "$ACTION_VALUE" '{channel: $ch, text: $value}'`
}

build_payload_blocks(){
  action_value=$ACTION_VALUE
  if [[ $action_value == "@templates/"* ]]; then
    log_info "Processing 'blocks' case from 'templates/'"
    action_value=`cat /${action_value:1} | jq '.blocks'`
  else
    log_info "Processing 'blocks' case"
  fi
  payload=`jq -n --arg ch "$ACTION_CHANNEL_ID" --argjson value "$action_value" '{channel: $ch, blocks: $value}'`
}

##
## Main program
##
env
case $ACTION_MECHANISM in
  "text")
    build_payload_text;
    ;;
  "blocks")
    build_payload_blocks;
    ;;
  *)
    log_error "Unknown mechanism '$ACTION_MECHANISM'"
    ;;
esac
log_info "Payload=$payload"
send_payload_slack_api;
exit 0