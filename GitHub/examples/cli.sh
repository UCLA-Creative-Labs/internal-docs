#!/bin/bash

# Remember to add 
# source ~/.cli/cli.sh 
# to ~/.bash_profile, ~/.bash_rc, or ~/.zsh_rc

# Allow you to resource your CLI
# Very handy for testing
function cli(){
	source ~/.cli/cli.sh 
}

# Create a new project locally and on Github
# Intialize and Push to Github and open VS code
# Export to path $USERNAME, $PROJECTPATH, $CLPATH, and $ACCESSTOKEN in .env
function create(){
	curr_dir="$(pwd)"
	echo "Previous Directory: $curr_dir"
	cd ~
	source '.env'
  cd ~/.cli
  CL=0
  PRIVATE=0
  TECH=0
  LOCAL=0
  NAME=""
  USER=$USERNAME
  path=$PROJECTPATH
  for arg in "$@"
  do
    case "$arg" in
      -p | --private)         PRIVATE=1           ;;
      -cl | --creative-labs)  CL=1                ;;
      -t | --tech)            TECH=1              ;;
      -l | --local)           LOCAL=1             ;;
      *)                      NAME="$NAME$arg "   ;;
    esac
    shift
  done
  NAME="$(echo -e "${NAME}" | tr -d '[:space:]')"
  if [[ "$CL" -eq 1 ]]; then
    USER="UCLA-Creative-Labs"
    path=$CLPATH
  fi
	python3 create.py $NAME $CL $PRIVATE $TECH
  if [[ "$LOCAL" -eq 1 ]]; then
    mkdir $path$NAME
    cd $path$NAME
    touch README.md
    echo "# $NAME" > README.md
    touch .gitignore
    git init
    git add .
    git commit -m "init commit"
    git branch -M main
    git remote add origin git@github.com:$USER/$NAME.git
    git push -u origin main
    code .
  fi
  cd "$curr_dir"
}
