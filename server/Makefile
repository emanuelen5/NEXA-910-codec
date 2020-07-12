develop:
	$(MAKE) -j livereload serve-watch webpack-watch

# Web server (Python)
serve:
	$(SHELL) start_server.sh
serve-watch:
	$(SHELL) start_server_dev.sh

# Client code (JS etc.)
webpack-watch:
	npx webpack --watch
webpack-build:
	npx webpack
# Reload of client code
livereload:
	livereload --host 0.0.0.0 -t ./static

# pytest-watch:
# 	PYTHONPATH="src" pytest-watch

.PHONY: serve livereload develop watch build
