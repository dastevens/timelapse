import previewFolder, previewUrl from config
import web
from picamera import PiCamera

urls = ('.*', 'Api')

class Api:
	def GET(self):
		camera = PiCamera()
		camera.capture(previewFolder + 'preview.jpg')
		return '{ "previewUrl": "' + previewUrl + '" }'

if __name__ == "__main__":
	app = web.application(urls, globals())
	app.run()
