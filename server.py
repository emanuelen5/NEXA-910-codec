from transmit import NEXA_UART
from flask import Flask, request
app = Flask(__name__)

nexa_uart = NEXA_UART(port="/dev/ttyACM0")

@app.route('/')
def hello_world():
    with open("./index.html") as f:
        index_content = f.read()
    return index_content

@app.route('/lamp', methods=['GET'])
def lamp():
    print(request.args.to_dict())
    lamp = request.args.get("lamp")
    state = request.args.get("state")
    response = nexa_uart.send_command(" ".join([lamp, state]))
    print(response)
    return dict(OK=True, response=response)
