ENV ?= dev

.PHONY: help checkfixup checkformatting fixformatting lint typecheck test setup build ci

help:	## Show this help
	@printf "\nUSAGE: make [command] \n\n"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf " \033[36m%-20s\033[0m %s\n", $$1, $$2}'
	@printf '\n'

checkfixup:	## Checks for fixup! in commit messages
	scripts/checkfixup

checkformatting:	## Checks code formatting
	npm run checkformatting

fixformatting:	## Fixes code formatting
	npm run fixformatting

lint:	## Runs linting
	npm run lint

typecheck:	## Runs TypeScript type checking
	npm run typecheck

test:	## Runs test suite
	CI=true npm test

setup:	## Installs dependencies
	npm clean-install

build:	## Builds the project
	npm run build

ci: lint typecheck checkformatting	## Runs all fast checks
