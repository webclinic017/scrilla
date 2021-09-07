SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
SCRIPT_NAME='run-application'
nl=$'\n'
tab="     "
ind="   "
SCRIPT_DES="Spin up a container of the application. Application image must exist first. \
${nl}${ind}Invoke \e[3mbuild-image\e[0m to build application image or else do so manually \
through${nl}${ind}\e[3mdocker build\e[0m. This script will start a standalone instance of \
the backend${nl}${ind}server and inject into it at runtime the values found in the \
\e[3mstandalone.env\e[0m.${nl}${ind}You will be prompted to configure this file if \
you haven't already and  ${nl}${ind}exit."

PROJECT_DIR=$SCRIPT_DIR/../..
UTIL_DIR=$PROJECT_DIR/scripts/util
APP_DIR=$PROJECT_DIR/app
ENV_DIR=$PROJECT_DIR/env

source "$UTIL_DIR/sys-util.sh"

if [ "$1" == "--help" ] || [ "$1" == "--h" ] || [ "$1" == "-help" ] || [ "$1" == "-h" ]
then
    help "$SCRIPT_DES" "$SCRIPT_NAME"
else
    source "$UTIL_DIR/env-vars.sh" 

    docker run \
    --name $CONTAINER_NAME \
    --publish $APP_PORT:$APP_PORT \
    --env-file "$ENV_DIR/runtime.env" \
    $IMG_NAME:$IMG_TAG
fi