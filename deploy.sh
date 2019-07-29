yarn build:prod

cd dist
git init
git remote add origin git@bfdes.in:~/blog/.git
git add .
git commit --allow-empty -m ""
git push origin master --force
