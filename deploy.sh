yarn build:prod

cd dist
rm -rf .git
git init
git remote add origin git@bfdes.in:~/blog/.git
git add .
git commit --allow-empty-message -m ""
git push origin master --force
