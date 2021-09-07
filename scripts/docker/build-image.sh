SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
SCRIPT_NAME='build-image'
nl=$'\n'
tab="     "
ind="   "
SCRIPT_DES="Build an image of the application." 

PROJECT_DIR=$SCRIPT_DIR/../..
UTIL_DIR=$PROJECT_DIR/scripts/util
APP_DIR=$PROJECT_DIR/app
ENV_DIR=$PROJECT_DIR/env

source "$UTIL_DIR/sys-util.sh"
source "$UTIL_DIR/env-vars.sh"

cd "$PROJECT_DIR"

docker build -t "$IMG_NAME:$IMG_TAG" .