# list recipes
default:
  @just --list

# install npm dependencies
[working-directory: "./site/"]
install:
  npm install

# serve the site locally
[working-directory: "./site/"]
dev: install
  npm run server

# load the latest artifacts
[working-directory: "./site/"]
sync stage:
  npm run sync:{{ stage }}

# build the site
[working-directory: "./site/"]
build stage: install (sync stage)
  npm run build:{{ stage }}

# deploy the site
deploy stage: (build stage)
  npx wrangler@latest deploy --env {{ stage }}
