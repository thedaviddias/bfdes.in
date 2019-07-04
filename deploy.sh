#!/bin/bash
set -xe

if [ $TRAVIS_BRANCH == 'master' ] ; then
  eval "$(ssh-agent -s)"
  ssh-add ~/.ssh/id_rsa

  cd dist
  git init

  git remote add deploy "ssh://travis@bfdes.in:$PORT/opt/blog"
  git add .
  git commit -m "Deploy"
  git push --force deploy master
fi
