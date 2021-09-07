#!/bin/bash

# Entrypoint script for Dockerfile that will deploy the application onto a gunicorn web server.
# If the user provides arguments, the entrypoint will switch to CLI mode and execute the given
# function and output results to the terminal.
# 
# NOTE: Dockerfile sets WORKDIR to /home/app/

SCRIPT_NAME='entrypoint'

ROOT_DIR="/home/"
APP_DIR="/home/app/"

source "/home/scripts/util/sys-util.sh"

log "Entrypoint Argument(s): \e[3m$(concat_args $@)\e[0m" "$SCRIPT_NAME"
log "Executing from \e[3m$(pwd)\e[0m" "$SCRIPT_NAME"

if [ $# -eq 0 ] || [ "$1" == "wait-for-it" ] || [ "$1" == "bash" ] || [ "$1" == "psql" ]
then
    if [ "$1" == "wait-for-it" ]
    then
        log "Waiting for \e[3m$POSTGRES_HOST:$POSTGRES_PORT\e[0m database service connection." "$SCRIPT_NAME"
        wait-for-it "$POSTGRES_HOST:$POSTGRES_PORT"
    fi

    log "Collecting static files." "$SCRIPT_NAME"
    python manage.py collectstatic --noinput

    log "Checking for new migrations." "$SCRIPT_NAME"
    python manage.py makemigrations
    
    log "Migrating Django database models." "$SCRIPT_NAME"
    python manage.py migrate

    # Entrypoints
    if [ "$1" == "bash" ]
    then
        log "Starting \e[3mBASH\e[0m shell session." "$SCRIPT_NAME"
        $@
        exit 0
    fi
    if [ "$1" == "psql" ]
    then
        log "Starting \e[3mpsql\e[0m shell session"
        PGPASSWORD="$POSTGRES_PASSWORD" psql --host="$POSTGRES_HOST" --port="$POSTGRES_PORT" --username="$POSTGRES_USER" 
        exit 0
    fi

    # TODO: start Django shell inside of container
    
    # Default entrypoint
    if [ "$APP_ENV" == "container" ] || [ "$APP_ENV" == "standalone" ] || [ "$APP_ENV" == "ecs-copilot" ]
    then
        cd "$SERVER_DIR"
        log "Binding WSGI app To \e[2mgunicorn\e[0m Web Server On 0.0.0.0:$APP_PORT" "$SCRIPT_NAME" 
        gunicorn core.wsgi:application --bind="0.0.0.0:$APP_PORT" --workers 3 --access-logfile '-'
    fi

    # OTHER IMAGE DEPLOYMENTS GO HERE

fi