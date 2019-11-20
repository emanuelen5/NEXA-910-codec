#! /usr/bin/env python3

import os
ADAFRUIT_IO_USERNAME = os.environ["ADAFRUIT_IO_USERNAME"]
ADAFRUIT_IO_KEY = os.environ["ADAFRUIT_IO_KEY"]

from argparse import ArgumentParser
args = ArgumentParser()
args.add_argument("--feed-name", "-f", default="NEXA Switches")
args.add_argument("--server-url", "-u", default="http://localhost:5000/lamp")
ns = args.parse_args()
FEED_NAME = ns.feed_name
SERVER_URL = ns.server_url

from Adafruit_IO import Client, MQTTClient
aio = Client(ADAFRUIT_IO_USERNAME, ADAFRUIT_IO_KEY)
feeds = aio.feeds()
print(f"Feeds: {feeds}")

# For sending on/off commands to server
import requests

def on_message(client, feed_id, payload):
    r = requests.get(url = SERVER_URL, params = dict(lamp=payload, state=""))
    print(r.json())

client = MQTTClient(ADAFRUIT_IO_USERNAME, ADAFRUIT_IO_KEY)
client.on_message = on_message

# For modifying TLS settings (since it did not work, due to self-signed certificate)
import ssl
client._client._ssl_context = None
client._client.tls_set_context(ssl._create_unverified_context())

client.connect()
client.subscribe(FEED_NAME)
client.loop_blocking()

