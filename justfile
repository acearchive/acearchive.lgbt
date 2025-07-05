# list recipes
default:
  @just --list

# install npm dependencies
install:
  npm install

# serve the site locally
dev: install
  npm run server

# load the latest artifacts
sync stage:
  npm run sync:{{ stage }}

# deploy the site
deploy stage: install (sync stage)
  npm run build:{{ stage }}
  npx wrangler@latest deploy --env {{ stage }}
