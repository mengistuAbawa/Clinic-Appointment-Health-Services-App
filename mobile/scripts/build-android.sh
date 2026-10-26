#!/usr/bin/env sh
set -eu

PROFILE="${1:-production}"
exec npx eas-cli build --platform android --profile "$PROFILE"
