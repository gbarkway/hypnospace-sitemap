#!/bin/bash
if [ -z "$SEED_DIR" ]; then SEED_DIR=$(dirname "$0"); fi

echo "Importing data from $SEED_DIR"

mongoimport --db hypnospace --collection pages --drop --file $SEED_DIR/pages.json
mongoimport --db hypnospace --collection captures --drop --file $SEED_DIR/captures.json

#TODO: indexes
#TODO: cloning the repo on Windows causes line endings to change and it makes pageserv container choke on this script