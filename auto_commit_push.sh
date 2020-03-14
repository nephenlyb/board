#!/bin/bash
git add --all
git commit -m "autoupdate `date +%F-%T`"
git push upstream master

./postUrls.sh