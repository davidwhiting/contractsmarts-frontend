default: dev

dev:
	npm run dev-server

build:
	npm run build

tree:
	mv excel-addin/node_modules . ; tree --dirsfirst excel-addin > tree.txt; mv node_modules excel-addin

