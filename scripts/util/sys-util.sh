function clean_docker(){
    docker system prune -f

    DANGLERS=$(docker images --filter "dangling=true" -q)
    if [ "$DANGLERS" != "" ]
    then 
        docker rmi -f $DANGLERS
    fi
}

### ARGUMENTS
## $1: The message you want to print
## $2: The name of the script from which the message originated

### DESCRIPTION
## Prints the inputted message with the current time and with
## text formatting. 
function log(){
    echo -e "\e[92m$(date +"%r")\e[0m: \e[4;32m$2\e[0m : >> $1"
}

function concat_args(){
    if [ ! $# -eq 0 ]
    then
        ARG_STRING=""
        for arg in $@
        do
            ARG_STRING="$ARG_STRING $1"
            shift
        done
        echo $ARG_STRING
    fi
}

# DESCRIPTION
## Prints the script name and the script description
## with new lines in between for formatting.
function help(){
    nl=$'\n'
    echo -e "${nl}\e[4m$2\e[0m${nl}${nl}   $1" 
}


function unixify(){
    for f in $1/*
    do
        if [ -d $f ]
        then 
            unixify $f
        else
            if [ ${f: -3} == ".sh" ]
            then
                echo "$f"
                dos2unix "$f"
            fi
        fi
    done
}

function make_scripts_executable(){
    for f in $1/*
    do
        if [ -d $f ]
        then
            make_scripts_executable $f
        else
            if [ ${f: -3} == ".sh" ]
            then
                echo "$f"
                chmod u+x "$f"
            fi
        fi
    done
}

function if_not_exists_create_dir(){
    if [ ! -d $1 ]
    then 
        mkdir $1
    fi
}

function if_not_exists_create_file(){
    if [ ! -f $1 ]
    then 
        touch $1
    fi
}

if [ "$1" == "unixify" ] || [ "$1" == "-u" ] || [ "$1" == "--u" ]
then
    unixify "$2"
elif [ "$1" == "execute" ] || [ "$1" == "-e" ] || [ "$1" == "--e" ]
then
    make_scripts_executable "$2"
fi