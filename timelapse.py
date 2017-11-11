from picamera import PiCamera
from time import sleep

def start(delay):
	camera = PiCamera()
	sleep(60)
	for filename in camera.capture_continuous('img-{timestamp:%Y%m%d-%H%M%S}.jpg'):
		print('Captured %s' % filename)
		sleep(delay)
    
if __name__ == "__main__":
	delay = 1
	print("Starting with delay = %i" % delay)
	start(delay)
