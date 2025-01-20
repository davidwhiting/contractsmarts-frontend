# Default value for DIR
DIR ?= excel-addin-fluent

default: dev

dev:
	npm run dev-server

build:
	npm run build

tree:
        mv $(DIR)/node_modules . ; tree --dirsfirst $(DIR) > tree.txt; mv node_modules $(DIR)
