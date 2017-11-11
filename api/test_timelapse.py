import unittest
import json

# The System Under Test
import Api from timelapse

# Monkey patch config
import config
config.previewFolder = "/path/to/preview/folder/"
config.previewUrl = "http://domain/path/to/preview/url/"

# Monkey patch PiCamera.capture
from picamera import PiCamera
def MockCapture(url):
	unittest.TestCase.assertEqual(url, config.previewFolder + "preview.jpg")
PiCamera.capture = MockCapture

class testApi(unittest.TestCase):

    def test_GET(self):
		api = Api()
		result = api.GET()
		parsed_result = json.loads(result)
        self.assertEqual(parsed_result["previewUrl"], )

if __name__ == '__main__':
    unittest.main()