from pymongo import MongoClient
import requests

uri = 'db:27017';
username = 'root';
password = 'example';
url = "mongodb://{}:{}@{}".format(username, password, uri);
client = MongoClient(url)

db = client.admin

if __name__ == '__main__':
    db.users.remove({})
    db.reviews.remove({})
    db.events.remove({})
    db.sessions.remove({})