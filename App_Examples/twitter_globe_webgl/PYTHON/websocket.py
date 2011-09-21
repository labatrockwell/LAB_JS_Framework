import socket
import hashlib
import base64
import sys, os
from select import select
import re
from threading import Thread
import signal
import time
import struct
import tweepy
import json
from ws4py.streaming import Stream

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
				if self.dohandshake(self.header):
					self.handshaken = True
		else:
			# first = data[0]
			# second = data[1]
			# 
			# if first != 0x81:
			# 	print "error on first byte"
			# if not ( second & 0x80 ):
			# 	print "error on second byte"
			# 	
			# length = int(second) & 0x7f # 0111 = f, 1111 = f
			# if length < 126:
			# 	mask = data[2:6]
			# 	text = data[6:]
			# elif length == 126:
			# 	mask = data[4:8]
			# 	text = data[8:]
			# 
			# unMaskedText = len( text )
			# for idx, val in enumerate( text ):
			# 	unMaskedText[idx] = text[idx] ^ mask[i%4]
			# 
			# print unMaskedText
			# 
			# self.data += data
			# msgs = self.data.split('\xff')
			# self.data = msgs.pop()
			# for msg in msgs:
			# 	if msg[0] == '\x00':
			# 		self.onmessage(msg[1:])
			self.onmessage( data )

	def dohandshake(self, header):
		key = ""
		
		for line in header.split('\r\n'):
			values = line.split(": ")
			if values[0].lower() == "sec-websocket-key":
				key = values[1]
				break
		
		shasum = hashlib.sha1()
		shasum.update(key)
		shasum.update("258EAFA5-E914-47DA-95CA-C5AB0DC85B11")
		key = base64.b64encode(shasum.digest())
		
		print key
		
		handshake = (
			"HTTP/1.1 101 Switching Protocols\r\n"
			"Upgrade: websocket\r\n"
			"Connection: Upgrade\r\n"
			"Sec-WebSocket-Accept: " + key + "\r\n"
			"\r\n"
		)
		
		self.client.send( handshake )

		return True

	def write_to_connection(self, bytes):
		return self.sock.sendall(bytes)

	def onmessage(self, data):
		print data

	def send(self, payload, binary=False):
		#self.client.send("\x00%s\xff" % data)
		if isinstance(payload, basestring) or isinstance(payload, bytearray):
			if not binary:
				self.write_to_connection(self.stream.text_message(payload).single())
			else:
				self.write_to_connection(self.stream.binary_message(payload).single())

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
				#self.connections[fileno].send(data)
				self.connections[fileno].send("hello")

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