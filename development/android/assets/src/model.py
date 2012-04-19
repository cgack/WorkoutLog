from google.appengine.ext import db

class WorkoutDefinition(db.Model):
	owner = db.UserProperty()
	logBy = db.IntegerProperty()
	description = db.StringProperty(multiline=True)

class WorkoutLog(db.Model):
	owner = db.UserProperty()
	description = db.StringProperty(multiline=True)
	result = db.StringProperty(multiline=True)
	date = db.DateTimeProperty(auto_now_add=True)