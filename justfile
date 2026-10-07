# list recipes
default:
  @just --list

# install npm dependencies
install:
  npm install

# serve the site locally
[working-directory: "./site/"]
dev: install
  npm run server

# build the site
[working-directory: "./site/"]
build stage: install
  npm run build:{{ stage }}

# deploy the site
deploy stage: (build stage)
  npx wrangler@latest deploy --env {{ stage }}
