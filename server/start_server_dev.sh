GUNICORN_FLAGS="--reload --access-logfile - --worker-class sync"
GUNICORN_WORKERS=1
GUNICORN_PORT=5001

gunicorn $GUNICORN_FLAGS --workers=$GUNICORN_WORKERS -b :$GUNICORN_PORT server:app
