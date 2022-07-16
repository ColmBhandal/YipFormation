.PHONY: transpile build

build: transpile
	sam build

transpile: node_modules
	npm run transpile

node_modules:
	npm i