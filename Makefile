default: dev

dev:
	npm run dev-server

build:
	npm run build

tree:
	mv excel-addin-fluent/node_modules . ; tree --dirsfirst excel-addin-fluent > tree.txt; mv node_modules excel-addin-fluent

