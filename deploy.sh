#!/bin/bash
set -xe

if [ $TRAVIS_BRANCH == 'master' ] ; then
  eval "$(ssh-agent -s)"
  ssh-add ~/.ssh/id_rsa

  cd dist
  git init

  git remote add deploy "ssh://travis@bfdes.in:$SSH_PORT/opt/blog"
  get config user.name "travis"
  git config user.password "bfdes@users.noreply.github.com"
  
  git add .
  git commit -m "Deploy"
  git push --force deploy master
fi
