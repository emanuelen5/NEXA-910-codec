from transmit import NEXA_UART
from flask import Flask, request, abort
app = Flask(__name__)

nexa_uart = NEXA_UART(port="/dev/ttyACM0")

@app.route('/')
def index_route():
    with open("./index.html") as f:
        index_content = f.read()
    return index_content

def get_arg(arg_name):
    arg = request.args.get(arg_name)
    if arg is None:
        abort(400)
    return arg

@app.route('/lamp', methods=['GET'])
def lamp_route():
    print(request.args.to_dict())
    lamp = get_arg("lamp")
    state = get_arg("state")
    command = " ".join([lamp, state]).strip()
    response = nexa_uart.send_command(command)
    print(response)
    return dict(OK=True, response=response)
