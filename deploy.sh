#!/bin/bash
set -xe

if [ $TRAVIS_BRANCH == 'master' ] ; then
  eval "$(ssh-agent -s)"
  ssh-add ~/.ssh/id_rsa

  cd public
  git init

  git remote add deploy "travis@bfdes.in:/opt/blog"
  git config user.name "Travis CI"
  git config user.email "bfdes@users.noreply.github.com"

  git add .
  git commit -m "Deploy"
  git push --force deploy master
else
  echo "Not deploying, since this branch isn't master."
fi
