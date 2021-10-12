class NEXATransmitMock:
    prompt = ">> "

    def __init__(self, port):
        pass

    def send_command(self, command, timeout_override=None, encoding="utf-8"):
        return command

    def send_command_read_response(self, command, timeout_override=0.1, print_com=True):
        if print_com:
            print(f"{self.prompt}{command}")
        response = self.send_command(command, timeout_override=timeout_override)
        if print_com:
            print(f"{response}")

    @classmethod
    def get_connected(cls):
        return [cls(port="FAKEPORT")]
