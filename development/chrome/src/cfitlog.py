import cgi
import datetime
import urllib
import webapp2  #bundled with appengin_e python2.7 sdk
import jinja2
import os 
import logging
import json
import re

from datetime import datetime

from google.appengine.ext import db
from google.appengine.api import users

from model import WorkoutDefinition
from model import WorkoutLog

#setup templating environment
jinja_environment = jinja2.Environment(
	loader=jinja2.FileSystemLoader(os.path.dirname(__file__)))


def parseDateTime(s):
	"""Create datetime object representing date/time
	   expressed in a string
 
	Takes a string in the format produced by calling str()
	on a python datetime object and returns a datetime
	instance that would produce that string.
 
	Acceptable formats are: "YYYY-MM-DD HH:MM:SS.ssssss+HH:MM",
							"YYYY-MM-DD HH:MM:SS.ssssss",
							"YYYY-MM-DD HH:MM:SS+HH:MM",
							"YYYY-MM-DD HH:MM:SS"
	Where ssssss represents fractional seconds.	 The timezone
	is optional and may be either positive or negative
	hours/minutes east of UTC.
	"""
	if s is None:
		return None
	# Split string in the form 2007-06-18 19:39:25.3300-07:00
	# into its constituent date/time, microseconds, and
	# timezone fields where microseconds and timezone are
	# optional.
	m = re.match(r'(.*?)(?:\.(\d+))?(([-+]\d{1,2}):(\d{2}))?$',
				 str(s))
	datestr, fractional, tzname, tzhour, tzmin = m.groups()
 
	# Create tzinfo object representing the timezone
	# expressed in the input string.  The names we give
	# for the timezones are lame: they are just the offset
	# from UTC (as it appeared in the input string).  We
	# handle UTC specially since it is a very common case
	# and we know its name.
	if tzname is None:
		tz = None
	else:
		tzhour, tzmin = int(tzhour), int(tzmin)
		if tzhour == tzmin == 0:
			tzname = 'UTC'
		tz = FixedOffset(timedelta(hours=tzhour,
								   minutes=tzmin), tzname)
 
	# Convert the date/time field into a python datetime
	# object.
	x = datetime.strptime(datestr, "%m/%d/%Y %H:%M:%S")
 
	# Convert the fractional second portion into a count
	# of microseconds.
	if fractional is None:
		fractional = '0'
	fracpower = 6 - len(fractional)
	fractional = float(fractional) * (10 ** fracpower)
 
	# Return updated datetime object with microseconds and
	# timezone information.
	return x.replace(microsecond=int(fractional), tzinfo=tz)
 

class MainPage(webapp2.RequestHandler):
	def get(self):

		if users.get_current_user():
			url = users.create_logout_url(self.request.uri)
			url_linktext = 'Logout'
			picklink = 2
		else:
			url = users.create_login_url(self.request.uri)
			url_linktext = 'Login'
			picklink = 1

		template_values = {
			'url' : url,
			'url_linktext' : url_linktext,
			'picklink' : picklink,
		}

		template = jinja_environment.get_template('index.html')
		self.response.out.write(template.render(template_values))


class PickWorkout(webapp2.RequestHandler):
	def get(self):
		
		workouts = []

		if users.get_current_user():
			wkouts = db.GqlQuery("SELECT * FROM WorkoutDefinition WHERE owner = :u", u=users.get_current_user())
		else:
			wkouts = ""

		for wkout in wkouts:
			workouts.append({'desc' : wkout.description, 'logBy' : wkout.logBy })
		
		userWorkouts = {'workouts': workouts};
		
#		self.response.headers["Content-Type"] = "application/javascript"
		self.response.out.write(json.dumps(userWorkouts))
		 

class Generate(webapp2.RequestHandler):
	def post(self):
		q = self.request.get('workout')
		by = int(self.request.get('logBy'))
		workout = WorkoutDefinition()
		if users.get_current_user():
			workout.owner = users.get_current_user()
		
		workout.description = q
		workout.logBy = by

		workout.put()


class ShowLogs(webapp2.RequestHandler):
	def get(self):
		workouts = []

		if users.get_current_user():
			wkouts = db.GqlQuery("SELECT * FROM WorkoutLog WHERE owner = :u ORDER BY date DESC", u=users.get_current_user())
		else:
			wkouts = ""

		for wkout in wkouts:
			workouts.append({'desc' : wkout.description, 'result' : wkout.result, 'date' : str(wkout.date) })
		
		userWorkouts = {'workouts': workouts};
		
#		self.response.headers["Content-Type"] = "application/javascript"
		self.response.out.write(json.dumps(userWorkouts))
		 

class StoreWorkout(webapp2.RequestHandler):
	def post(self):
		desc = self.request.get('workout')
		res = self.request.get('result')
		date = parseDateTime(self.request.get('date'))
		workout = WorkoutLog()

		if users.get_current_user():
			workout.owner = users.get_current_user()
		
		workout.description = desc
		workout.result = res
		workout.date = date
		
		workout.put()


class NotFound(webapp2.RequestHandler):
	def get(self):
		self.error(404)
		template = jinja_environment.get_template('404.html')
		self.response.out.write(template.render())

app = webapp2.WSGIApplication([('/', MainPage), 
							   ('/generate',Generate),
							   ('/pick', PickWorkout),
							   ('/store', StoreWorkout),
							   ('/show', ShowLogs),
							   ('/.*', NotFound)],
							   debug=True)
