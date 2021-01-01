#!/bin/sh

mongoimport --db hypnospace --collection pages --drop -h $MONGO_HOST --file ./pages.json
mongoimport --db hypnospace --collection captures --drop -h $MONGO_HOST --file ./captures.json