#!/bin/bash
set -e

if [ -z "$ANTHROPIC_API_KEY" ]; then 
  echo "Error: ANTHROPIC_API_KEY not set"
  exit 1
fi

if [ $# -lt 2 ]; then
  echo "Usage: claude-api.sh haiku|sonnet|opus \"prompt\""
  exit 1
fi

TASK_TYPE="$1"
PROMPT="$2"

case "$TASK_TYPE" in
  haiku)
    MODEL="claude-haiku-4-5-20251001"
    MAX_TOKENS=1024
    ;;
  sonnet)
    MODEL="claude-sonnet-5"
    MAX_TOKENS=2048
    ;;
  opus)
    MODEL="claude-opus-4-8"
    MAX_TOKENS=4096
    ;;
  *)
    echo "Error: Unknown model: $TASK_TYPE"
    exit 1
    ;;
esac

curl -s https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d "{\"model\": \"$MODEL\", \"max_tokens\": $MAX_TOKENS, \"messages\": [{\"role\": \"user\", \"content\": \"$PROMPT\"}]}" | jq -r '.content[0].text'
