import traceback
from logging import getLogger
from enum import Enum
from threading import Lock
from nexa.transmit import NEXA_UART, NEXA_UART_Init_Failed
from flask import Flask, request, abort, jsonify, redirect
from werkzeug.exceptions import HTTPException
from pathlib import Path

logger = getLogger(__name__)

static_path = str(Path(__file__).parent / ".build")
app = Flask(__name__, static_url_path='', static_folder=static_path)


@app.errorhandler(Exception)
def handle_error(e):
    traceback.print_exception(type(e), e, e.__traceback__)
    logger.error(e)
    logger.info(f"Got request: {request}\n\tdata: {request.data}\n\tform: {request.form}\n\targs: {request.args}")
    code = 500
    if isinstance(e, HTTPException):
        code = e.code
    return jsonify(error=str(e), status=code), code


class ENDPOINTS(str, Enum):
    ROOT = "/"
    ROOT_HTML = "/index.html"
    LAMP = "/api/lamp"

    def __str__(self):
        return self.value


class Globals:
    nexa_uart = None
    uart_lock = Lock()


def init_nexa():
    if Globals.nexa_uart is not None:
        return
    elif Globals.uart_lock.locked():
        raise RuntimeError("Cannot aquire NEXA UART lock")

    logger.info("Trying to initialize NEXA UART")
    lock_received = Globals.uart_lock.acquire(timeout=0)
    try:
        if lock_received:
            Globals.nexa_uart = NEXA_UART.get_connected()[0]
    except (NEXA_UART_Init_Failed, IndexError):
        logger.error("Could not initialize a NEXA UART. Will try again upon next request.")
        raise
    finally:
        if lock_received:
            Globals.uart_lock.release()


try:
    init_nexa()
except (NEXA_UART_Init_Failed, IndexError):
    pass


@app.route(ENDPOINTS.ROOT)
def root():
    return redirect(ENDPOINTS.ROOT_HTML)


def get_arg(arg_name):
    arg = request.args.get(arg_name)
    if arg is None:
        abort(400)
    return arg


@app.route(ENDPOINTS.LAMP, methods=['GET'])
def lamp_route():
    init_nexa()
    lamp = get_arg("lamp")
    state = get_arg("state")
    command = " ".join([lamp, state]).strip()
    response = Globals.nexa_uart.send_command(command)
    return dict(OK=True, response=response)
