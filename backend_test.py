import unittest
from pymongo import MongoClient
import requests

endpoint = "http://localhost:4000"

uri = 'db:27017';
username = 'root';
password = 'example';
url = "mongodb://{}:{}@{}".format(username, password, uri);
client = MongoClient(url)

db = client.admin

def getEndpoint(ep):
    return requests.get(endpoint+ep).json()

def postEndpoint(ep, data):
    return requests.post(endpoint+ep, data)

def putEndpoint(ep, data):
    return requests.put(endpoint+ep, data)

def removeData(collection, data):
    for dataInstance in collection.find(data):
        collection.remove(dataInstance['_id'])

# sample user data
regData1 = {'Name': 'testUser1',
        'Password': 'somePassword',
        'PasswordConf': 'somePassword'}
regData2 = {'Name': 'testUser2',
        'Password': 'somePassword2',
        'PasswordConf': 'somePassword2'}

# sample chef data
chefRegData1 = {'Name': 'testChef1',
        'Password': 'chefPass1',
        'PasswordConf': 'chefPass1', 
        'Chef': 1}
chefRegData2 = {'Name': 'testChef2',
        'Password': 'chefPass2',
        'PasswordConf': 'chefPass2', 
        'Chef': 1}

# sample review and event data
reviewData1 = {'Rating': 4}
eventData1 = {'Title': 'testEvent1',
        'Host': None}

userData1 = {'name': 'testUser1'}
userData2 = {'name': 'testUser2'}
chefData1 = {'name': 'testChef1'}
chefData2 = {'name': 'testChef2'}


class TestUserMethods(unittest.TestCase):

    def test_registerUser(self):
        r = postEndpoint("/register", regData1)
        self.assertEqual(r.status_code, 200)

        # clear database
        db.users.remove({})
        #removeData(db.users, userData1)


    def test_getUsers(self):
        r = postEndpoint("/register", regData1)
        self.assertEqual(r.status_code, 200)
        foundUser = False
        for user in getEndpoint("/users"):
            if user['name'] == regData1['Name']:
                foundUser = True
        self.assertTrue(foundUser)

        # clear database
        db.users.remove({})
        #removeData(db.users, userData1)

    def test_userIdIncrement(self):
        r = postEndpoint("/register", regData1)
        self.assertEqual(r.status_code, 200)

        r = postEndpoint("/register", regData2)
        self.assertEqual(r.status_code, 200)

        user1_id = -1
        user2_id = -1
        for user in getEndpoint("/users"):
            if user['name'] == regData1['Name']:
                user1_id = user['id']
            elif user['name'] == regData2['Name']:
                user2_id = user['id']

        self.assertEqual(user2_id - user1_id, 1)

        # clear database
        db.users.remove({})
        #removeData(db.users, userData1)
        #removeData(db.users, userData2)


class TestChefMethods(unittest.TestCase):

    def test_registerChef(self):
        r = postEndpoint("/register", chefRegData1)
        self.assertEqual(r.status_code, 200)

        removeData(db.users, chefData1)

    def test_getChefs(self):
        r = postEndpoint("/register", chefRegData1)
        self.assertEqual(r.status_code, 200)
        foundChef = False
        for chef in getEndpoint("/chefs"):
            if chef['name'] == chefRegData1['Name']:
                foundChef = True
        self.assertTrue(foundChef)

        # clear database
        db.users.remove({})
        #removeData(db.users, chefData1)

    def test_chefIdIncrement(self):
        r = postEndpoint("/register", chefRegData1)
        self.assertEqual(r.status_code, 200)

        r = postEndpoint("/register", chefRegData2)
        self.assertEqual(r.status_code, 200)

        chef1_id = -1
        chef2_id = -1
        for chef in getEndpoint("/chefs"):
            if chef['name'] == chefRegData1['Name']:
                chef1_id = chef['id']
            elif chef['name'] == chefRegData2['Name']:
                chef2_id = chef['id']

        self.assertEqual(chef2_id - chef1_id, 1)

        # clear database
        db.users.remove({})
        #removeData(db.users, chefData1)
        #removeData(db.users, chefData2)


'''class TestEventMethods(unittest.TestCase):

    def test_createEvent(self):
        r = postEndpoint("/register", regData1)
        self.assertEqual(r.status_code, 200)
        eventData1['Host'] = r.json()['_id']
        r = postEndpoint("/events", eventData1)
        self.assertEqual(r.status_code, 200)

        db.users.remove({})
        db.events.remove({})
        #removeData(db.users, userData1)
        #removeData(db.events, eventData1)

    def test_getEvents(self):
        r = postEndpoint("/register", regData1)
        self.assertEqual(r.status_code, 200)
        eventData1['Host'] = r.json()['_id']
        r = postEndpoint("/events", eventData1)
        self.assertEqual(r.status_code, 200)

        foundEvent = False
        for event in getEndpoint("/events"):
            if event['title'] == 'testEvent1':
                foundEvent = True
        self.assertTrue(foundEvent)

        # clear database
        db.users.remove({})
        db.events.remove({})
        #removeData(db.users, userData1)
        #removeData(db.events, eventData1)

class TestReviewMethods(unittest.TestCase):

    def test_createReview(self):
        r = postEndpoint("/register", regData1)
        self.assertEqual(r.status_code, 200)
        reviewData1['Reviewee'] = r.json()['_id']

        r = postEndpoint("/register", regData2)
        self.assertEqual(r.status_code, 200)
        reviewData1['Reviewer'] = r.json()['_id']
        eventData1['Host'] = r.json()['_id']

        r = postEndpoint("/events", eventData1)
        self.assertEqual(r.status_code, 200)
        reviewData1['Event'] = r.json()['_id']

        r = postEndpoint("/reviews", reviewData1)
        self.assertEqual(r.status_code, 200)

        db.users.remove({})
        #removeData(db.users, userData1)
        #removeData(db.users, userData2)
        removeData(db.events, eventData1)
        removeData(db.reviews, {})


    def test_getReviews(self):
        # reviewee information loading
        r = postEndpoint("/register", regData1)
        self.assertEqual(r.status_code, 200)
        reviewData1['Reviewee'] = r.json()['_id']
        reviewee = r.json()['_id']

        # reviewer information loading
        r = postEndpoint("/register", regData2)
        self.assertEqual(r.status_code, 200)
        reviewData1['Reviewer'] = r.json()['_id']
        eventData1['Host'] = r.json()['_id']
        reviewer = r.json()['_id']

        # associated event information loading
        r = postEndpoint("/events", eventData1)
        self.assertEqual(r.status_code, 200)
        reviewData1['Event'] = r.json()['_id']
        eventid = r.json()['_id']

        r = postEndpoint("/reviews", reviewData1)
        self.assertEqual(r.status_code, 200)

        foundReview = False
        for review in getEndpoint("/reviews"):
            if ((review['event'] == eventid) 
                and (review['reviewee'] == reviewee) 
                and (review['reviewer'] == reviewer)
                and (review['rating'] == 4)):
                foundReview = True

        self.assertTrue(foundReview)

        db.users.remove({})
        #removeData(db.users, userData1)
        #removeData(db.users, userData2)
        removeData(db.events, eventData1)
        removeData(db.reviews, reviewData1)'''

if __name__ == '__main__':
    #removeData(db.users, {})
    unittest.main(verbosity=2)
