# Makefile for Node.js project
default: install

# Default target to install dependencies
install: node_modules

node_modules: package.json package-lock.json
	npm install
	touch node_modules
