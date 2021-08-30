SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
SCRIPT_NAME='run-server'
nl=$'\n'
tab="     "
ind="   "
SCRIPT_DES="Execute this script to launch a Django development server. The \e[3mlocal.env\e[0m\
 file will be loaded into the shell ${nl}${ind}session before the server is started. Change APP_PORT in\
 \e[3m.env\e[0m file to modify the port the server will run on.${nl}${ind}See environment file \
for more information on application configuration." 

PROJECT_DIR=$SCRIPT_DIR/..
UTIL_DIR=$SCRIPT_DIR/util
APP_DIR=$PROJECT_DIR/scrilla
ENV_DIR=$PROJECT_DIR/env
source "$SCRIPT_DIR/util/sys-util.sh"
source "$UTIL_DIR/env-vars.sh"


if [ "$1" == "--help" ] || [ "$1" == "--h" ] || [ "$1" == "-help" ] || [ "$1" == "-h" ]
then
    help "$SCRIPT_DES" "$SCRIPT_NAME"
else
    cd "$PROJECT_DIR"

    log "Installing Python dependencies." "$SCRIPT_NAME"
    pip3 install -r requirements.txt

    cd "$APP_DIR"

    ls -al 
    log "Collecting static files." "$SCRIPT_NAME"
    python3 manage.py collectstatic --noinput
    
    if [ -f "$APP_DIR/db.sqlite3" ]
    then
        log 'Deleting \e[4mSQLite\e[0m flat file to ensure clean migrations.' $SCRIPT_NAME
        rm -rf "$APP_DIR/db.sqlite3"
    fi

    log "Verifying migrations are up-to-date." "$SCRIPT_NAME"
    python3 manage.py makemigrations

    log 'Migrating Django database models.' "$SCRIPT_NAME"
    python3 manage.py migrate

    HOST="$APP_HOST:$APP_PORT"      
    if [ $# -eq 0 ] || [ "$1" == "gunicorn" ]
    then
        log "Starting local \e[1mgunicorn\e[0m server On \e[3m$HOST\e[0m." $SCRIPT_NAME
        gunicorn core.wsgi:application --bind="$HOST" --workers 3 --access-logfile '-'
    elif [ "$1" == "dev" ]
    then
        log "Starting \e[1mDjango\e[0m development server On \e[3m$HOST\e[0m." $SCRIPT_NAME 
        python3 manage.py runserver "$HOST"
    fi
fi