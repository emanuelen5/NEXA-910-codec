FLASK_APP=server.py FLASK_ENV=development \
	flask run --host 0.0.0.0 --port 5000 --extra-files "*.py:src/*"
