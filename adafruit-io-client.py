#! /usr/bin/env python3

import os
import sys
from argparse import ArgumentParser
from Adafruit_IO import Client, MQTTClient
# For sending on/off commands to server
import requests

def get_env(env_name):
    if env_name in os.environ:
        return os.environ[env_name]
    raise KeyError(f"The environment variable {env_name} has not been set")

ADAFRUIT_IO_USERNAME = get_env("ADAFRUIT_IO_USERNAME")
ADAFRUIT_IO_KEY = get_env("ADAFRUIT_IO_KEY")

def get_on_message(url):
    def on_message(client, feed_id, payload):
        r = requests.get(url=url, params=dict(lamp=payload, state=""))
        print(r.json())
    return on_message

def main():
    args = ArgumentParser(description="An MQTT client that gets messages from an Adafruit IO feed and sends its payload to a NEXA server")
    args.add_argument("--feed-name", "-f", default="NEXA Switches", help="The name of the feed on Adafruit.io that you want to subscribe to")
    args.add_argument("--server-url", "-u", default="http://localhost:5000", help="The URL of the server that controls the NEXA switches")
    ns = args.parse_args()
    FEED_NAME = ns.feed_name
    SERVER_URL = ns.server_url

    # List feeds
    aio = Client(ADAFRUIT_IO_USERNAME, ADAFRUIT_IO_KEY)
    feeds = aio.feeds()
    feed_names = [f.name for f in feeds]
    if FEED_NAME not in feed_names:
        print(f"The feed \"{FEED_NAME}\" does not exist")
        print(f"Please choose between the available feeds: {feed_names}")
        sys.exit(-1)

    # Connect to Adafruit IO MQTT server
    client = MQTTClient(ADAFRUIT_IO_USERNAME, ADAFRUIT_IO_KEY)
    lamp_endpoint = SERVER_URL + "/lamp"
    client.on_message = get_on_message(lamp_endpoint)

    # For modifying TLS settings (since it did not work, due to self-signed certificate)
    import ssl
    client._client._ssl_context = None
    client._client.tls_set_context(ssl._create_unverified_context())

    client.connect()
    client.subscribe(FEED_NAME)
    client.loop_blocking()

if __name__ == "__main__":
    main()
