import cgi
import urllib
import os
import json
import wsgiref.handlers


from google.appengine.ext import webapp
from google.appengine.ext import db
from google.appengine.api import users
from google.appengine.ext.webapp.util import run_wsgi_app
from google.appengine.ext.webapp import template

from model import WorkoutDefinition
from model import WorkoutLog


## start http://code.activestate.com/recipes/577135/
def _datetime_from_str(time_str):
    import time
    import datetime
    formats = [
        # <scope>, <pattern>, <format>
        ("year", "YYYY", "%Y"),
        ("month", "YYYY-MM", "%Y-%m"),
        ("day", "YYYY-MM-DD", "%Y-%m-%d"),
        ("hour", "YYYY-MM-DD HH", "%Y-%m-%d %H"),
        ("minute", "YYYY-MM-DD HH:MM", "%Y-%m-%d %H:%M"),
        ("second", "YYYY-MM-DD HH:MM:SS", "%Y-%m-%d %H:%M:%S"),
        ("seconda", "YY-MM-DD HH:MM:SS", "%y-%m-%d %H:%M:%S"),
        ("secs", "MM/DD/YYYY HH:MM:SS", "%m/%d/%Y %H:%M:%S"),
        ("secsa", "MM/DD/YY HH:MM:SS", "%m/%d/%y %H:%M:%S"),
        # ".<microsecond>" at end is manually handled below
        ("microsecond", "YYYY-MM-DD HH:MM:SS", "%Y-%m-%d %H:%M:%S"),
    ]
    for scope, pattern, format in formats:
        if scope == "microsecond":
            # Special handling for microsecond part. AFAIK there isn't a
            # strftime code for this.
            if time_str.count('.') != 1:
                continue
            time_str, microseconds_str = time_str.split('.')
            try:
                microsecond = int((microseconds_str + '000000')[:6])
            except ValueError:
                continue
        try:
            # This comment here is the modern way. The subsequent two
            # lines are for Python 2.4 support.
            #t = datetime.datetime.strptime(time_str, format)
            t_tuple = time.strptime(time_str, format)
            t = datetime.datetime(*t_tuple[:6])
        except ValueError:
            pass
        else:
            if scope == "microsecond":
                t = t.replace(microsecond=microsecond)
            return t
    else:
        raise ValueError("could not determine date from %r: does not "
            "match any of the accepted patterns ('%s')"
            % (time_str, "', '".join(s for s, p, f in formats)))
## end of http://code.activestate.com/recipes/577135/ }}}


class MainPage(webapp.RequestHandler):
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
            'url': url,
            'url_linktext': url_linktext,
            'picklink': picklink,
        }

        path = os.path.join(os.path.dirname(__file__), 'templates/home.html')
        self.response.out.write(template.render(path, template_values))


class Define(webapp.RequestHandler):
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
            'url': url,
            'url_linktext': url_linktext,
            'picklink': picklink,
        }

        path = os.path.join(os.path.dirname(__file__), 'templates/generate.html')
        self.response.out.write(template.render(path, template_values))


class PickWorkout(webapp.RequestHandler):
    def get(self):
        workouts = []

        if users.get_current_user():
            url = users.create_logout_url(self.request.uri)
            url_linktext = 'Logout'
            picklink = 2
            wkouts = db.GqlQuery("SELECT * FROM WorkoutDefinition WHERE owner = :u", u=users.get_current_user())
        else:
            wkouts = ""
            url = users.create_login_url(self.request.uri)
            url_linktext = 'Login'
            picklink = 1

        for wkout in wkouts:
            workouts.append({'desc': wkout.description, 'logBy': wkout.logBy})

        template_values = {
            'url': url,
            'url_linktext': url_linktext,
            'picklink': picklink,
            'workouts': workouts
        }

        path = os.path.join(os.path.dirname(__file__), 'templates/pick.html')
        self.response.out.write(template.render(path, template_values))


class Generate(webapp.RequestHandler):
    def post(self):
        q = self.request.get('workout')
        by = int(self.request.get('logBy'))
        workout = WorkoutDefinition()
        if users.get_current_user():
            workout.owner = users.get_current_user()

        workout.description = q
        workout.logBy = by

        workout.put()


class ShowLogs(webapp.RequestHandler):
    def get(self):
        workouts = []

        if users.get_current_user():
            wkouts = db.GqlQuery("SELECT * FROM WorkoutLog WHERE owner = :u ORDER BY date DESC", u=users.get_current_user())
            url = users.create_logout_url(self.request.uri)
            url_linktext = 'Logout'
            picklink = 2
        else:
            wkouts = ""
            url = users.create_login_url(self.request.uri)
            url_linktext = 'Login'
            picklink = 1

        for wkout in wkouts:
            workouts.append({'desc': wkout.description, 'result': wkout.result, 'date': str(wkout.date.replace(microsecond=0))})

        template_values = {
            'url': url,
            'url_linktext': url_linktext,
            'picklink': picklink,
            'workouts': workouts
        }

        path = os.path.join(os.path.dirname(__file__), 'templates/history.html')
        self.response.out.write(template.render(path, template_values))


class StoreWorkout(webapp.RequestHandler):
    def post(self):
        desc = self.request.get('workout')
        res = self.request.get('result')
        date = _datetime_from_str(self.request.get('date'))
        workout = WorkoutLog()

        if users.get_current_user():
            workout.owner = users.get_current_user()

        workout.description = desc
        workout.result = res
        workout.date = date

        workout.put()


class NotFound(webapp.RequestHandler):
    def get(self):
        self.error(404)
        path = os.path.join(os.path.dirname(__file__), '404.html')
        self.response.out.write(template.render(path, None))


app = webapp.WSGIApplication([('/', MainPage),
                                ('/generate', Generate),
                                ('/define', Define),
                                ('/pick', PickWorkout),
                                ('/store', StoreWorkout),
                                ('/show', ShowLogs),
                                ('/home', MainPage),
                                ('/.*', NotFound)],
                                debug=True)
