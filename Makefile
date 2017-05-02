SHELL:=/bin/bash

.PHONY: help install test lint

.DEFAULT_GOAL := help

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

# If the first argument is one of the supported commands...
SUPPORTED_COMMANDS := test2
SUPPORTS_MAKE_ARGS := $(findstring $(firstword $(MAKECMDGOALS)), $(SUPPORTED_COMMANDS))
ifneq "$(SUPPORTS_MAKE_ARGS)" ""
	# use the rest as arguments for the command
	COMMAND_ARGS := $(wordlist 2,$(words $(MAKECMDGOALS)),$(MAKECMDGOALS))
	# ...and turn them into do-nothing targets
	$(eval $(COMMAND_ARGS):;@:)
endif

install: ## Install dependencies
	cd .lib && npm install

test: ## Tests every platforms. You can also select one or more. Ex: make test sd npg
	cd .lib && EZPAARSE_PLATFORM_TO_TEST="$(COMMAND_ARGS)" npm test

lint: ## Run syntax verification on javascript files
	cd .lib && npm run lint
