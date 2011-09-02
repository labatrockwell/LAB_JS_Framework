import socket
import hashlib
import sys, os
from select import select
import re
from threading import Thread
import signal
import time
import struct
import tweepy
import json

receive_address = 'localhost', 54544

CONSUMER_KEY = "LAXmG8IRbqDc9ALD7Eg"
CONSUMER_SECRET = "5Cw2CFwwznLiI8fZxn2NuUCz8uGyEiqzsTHh8bW8BzY"
ACCESS_KEY = "14787753-piEfHYbBzEfINj3McdIFcl6vCIFA98dyMyji7qDJG"
ACCESS_SECRET = "vtyZgpcwEBkNf1cw74EdGZBNxBucZkyWArU8XwEKJA"

class MessageHolder(object):
	
	def __init__(self):
		self.new = False
		self.lat = 0
		self.lng = 0
		
	def set(self, _lat, _lng ): 
		self.lat = _lat
		self.lng = _lng
	
	def get( self ):
		return self.lat, self.lng

class StreamWatcherListener(tweepy.StreamListener):

	def on_status(self, status):
		global msg
		
		try:
			if status.coordinates is not None:
				coords = status.coordinates['coordinates']
				msg.set( coords[0], coords[1] )
				msg.new = True
				#print coords
		except:
			# Catch any unicode errors while printing to console
			# and just ignore them to avoid breaking application.
			pass

	def on_error(self, status_code):
		print 'An error has occured! Status code = %s' % status_code
		return True  # keep stream alive

	def on_timeout(self):
		print 'Snoozing Zzzzzz'

class WebSocket(object):
	handshake = (
		"HTTP/1.1 101 Web Socket Protocol Handshake\r\n"
		"Upgrade: WebSocket\r\n"
		"Connection: Upgrade\r\n"
		"WebSocket-Origin: %(origin)s\r\n"
		"WebSocket-Location: ws://%(bind)s:%(port)s/\r\n"
		"Sec-Websocket-Origin: %(origin)s\r\n"
		"Sec-Websocket-Location: ws://%(bind)s:%(port)s/\r\n"
		"\r\n"
	)
	def __init__(self, client, server):
		self.client = client
		self.server = server
		self.handshaken = False
		self.header = ""
		self.data = ""

	def feed(self, data):
		if not self.handshaken:
			self.header += data
			if self.header.find('\r\n\r\n') != -1:
				parts = self.header.split('\r\n\r\n', 1)
				self.header = parts[0]
				if self.dohandshake(self.header, parts[1]):
					self.handshaken = True
		else:
			self.data += data
			msgs = self.data.split('\xff')
			self.data = msgs.pop()
			for msg in msgs:
				if msg[0] == '\x00':
					self.onmessage(msg[1:])

	def dohandshake(self, header, key=None):
		digitRe = re.compile(r'[^0-9]')
		spacesRe = re.compile(r'\s')
		part_1 = part_2 = origin = None
		for line in header.split('\r\n')[1:]:
			name, value = line.split(': ', 1)
			if name.lower() == "sec-websocket-key1":
				key_number_1 = int(digitRe.sub('', value))
				spaces_1 = len(spacesRe.findall(value))
				if spaces_1 == 0:
					return False
				if key_number_1 % spaces_1 != 0:
					return False
				part_1 = key_number_1 / spaces_1
			elif name.lower() == "sec-websocket-key2":
				key_number_2 = int(digitRe.sub('', value))
				spaces_2 = len(spacesRe.findall(value))
				if spaces_2 == 0:
					return False
				if key_number_2 % spaces_2 != 0:
					return False
				part_2 = key_number_2 / spaces_2
			elif name.lower() == "origin":
				origin = value
		if part_1 and part_2:
			challenge = struct.pack('!I', part_1) + struct.pack('!I', part_2) + key
			response = hashlib.md5(challenge).digest()
			handshake = WebSocket.handshake % {
				'origin': origin,
				'port': self.server.port,
				'bind': self.server.bind
			}
			handshake += response
		else:
			handshake = WebSocket.handshake % {
				'origin': origin,
				'port': self.server.port,
				'bind': self.server.bind
			}
		self.client.send(handshake)
		return True

	def onmessage(self, data):
		print data

	def send(self, data):
		print "got it!"
		print data
		self.client.send("\x00%s\xff" % data)

	def close(self):
		self.client.close()

class WebSocketServer(object):
	def __init__(self, bind, port, cls):
		self.socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
		self.socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
		self.socket.bind((bind, port))
		self.bind = bind
		self.port = port
		self.cls = cls
		self.connections = {}
		self.listeners = [self.socket]

	def listen(self, backlog=5):
		self.socket.listen(backlog)
		self.running = True
		
		self.clientNo = 0
		
		global msg
		while self.running:
			if msg.new == True and self.clientNo != 0:
				lat,lng = msg.get()
				data = str(lat)+","+str(lng)
				msg.new = False
				client = self.connections[self.clientNo].client
				fileno = client.fileno()	
				self.connections[fileno].send(data)

			rList, wList, xList = select(self.listeners, [], self.listeners, 1)
			for ready in rList:
				self.clientNo = ready
				if ready == self.socket:
					print "New client connection."
					client, address = self.socket.accept()
					fileno = client.fileno()
					self.listeners.append(fileno)
					self.connections[fileno] = self.cls(client, self)
				else:
					client = self.connections[ready].client
					data = client.recv(1024)
					fileno = client.fileno()
					if data:
						self.connections[fileno].feed(data)
					else:
						self.connections[fileno].close()
						del self.connections[fileno]
						self.listeners.remove(ready)
			for failed in xList:
				if failed == self.socket:
					for fileno, conn in self.connections:
						conn.close()
					self.running = False


if __name__ == '__main__':
	try:
		msg = MessageHolder()

		server = WebSocketServer("localhost", 9999, WebSocket)
		print "Starting web socket server on port 9999."
		server_thread = Thread(target=server.listen, args=[5])
		server_thread.start()

		auth = tweepy.OAuthHandler(CONSUMER_KEY, CONSUMER_SECRET)
		auth.set_access_token(ACCESS_KEY, ACCESS_SECRET)
		api = tweepy.API(auth)

		stream = tweepy.Stream(auth, StreamWatcherListener(), timeout=5000)

		stream.sample()
	except KeyboardInterrupt:
		print '\nGoodbye!'
		server.clientNo = 0
		server.running = False
		sys.exit()
		
		
# Add SIGINT handler for killing the threads
# def signal_handler(signal, frame):
# 	print "Received exit command."
# 	server.running = False
# 	sys.exit()
# 
# signal.signal(signal.SIGINT, signal_handler)
# signal.signal(signal.SIGTERM, signal_handler)

# while True:
# 	time.sleep(100)