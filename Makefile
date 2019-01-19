CLI_DIR ?= $(shell pwd)/packages/cli/

smoke_test:
	node cli.js /tmp/test

lint:
	npm run lint

install-cli:
	cd ${CLI_DIR} && \
	  npm install -g

build_image:
	docker build -t create-cac-app .

pristine_env: build_image
	docker run -i -t create-cac-app /bin/bash

publish: lint
	npm publish --access=public
