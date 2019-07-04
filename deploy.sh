#!/bin/bash
set -xe

if [ $TRAVIS_BRANCH == 'master' ] ; then
  eval "$(ssh-agent -s)"
  ssh-add ~/.ssh/id_rsa

  cd dist
  git init

  git remote add deploy "travis@bfdes.in:/opt/blog"
  git config user.name "travis"
  git config user.email "travis@travis.org"

  git add .
  git commit -m "deploy"
  git push --force deploy master
fi
