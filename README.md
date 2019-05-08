Docker:
docker stop $(docker ps -a -q)
docker rm $(docker ps -a -q)

# CS 130 Project: Gobble
Discussion 1B

## Local Setup
- Install mongodb and run `mongod`
- `cd backend/server; npm install; npm start`
- `cd frontend; npm install; npm start`

(for recommendations' functionality)
- Install redis and kafka
- `redis-server`
- `bin/zookeeper-server-start.sh config/zookeeper.properties`
- `bin/kafka-server-start.sh config/server.1.properties`
- `bin/kafka-topics.sh --create --topic rating --zookeeper localhost:2181 --partitions 1 --replication-factor 1`
- `cd reco: python flask_server.py`

## Docker Setup
1. Download Docker and Docker Compose (if you're on a Mac it's included)
```bash
cd gobble
docker-compose build
docker-compose up

# if you're having trouble
docker-compose build --no-cache
docker-compose up

# or you get the bcrypt ELF error
docker ps # get <backend_id>
docker exec -it <backend_id> bash
npm uninstall bcrypt
npm install bcrypt
```

React frontend will be open on `localhost:3000` and includes hot-reloading.

Node.js Express backend will be open on `localhost:4000` and also includes hot-reloading.

### Some Tips
ctrl+c will close all the containers.
```bash
# list running containers, and find their container ids
docker ps
# run this to start an interactive Bash session to run commands inside the container
docker exec -it <container-id> bash
```

## Backend Setup
To start the backend server, first make sure there is an instance of MongoDB running on port 27017 (default mongo port).

Then, run

```bash
cd backend/server
npm install
npm install mongoose
npm start
```

The server will be running on localhost:4000/.

To run tests, run
```bash
docker exec -it <container-id> python backend_test.py
```

To clear all entries in the MongoDB database, run
```bash
docker exec -it <container-id> python clear_dbs.py
```

## Recommendation Engine
To recommend chefs to users, we will use a simple user-based collaborative filtering algorithm.

Given a stream of ratings in the form of `userId, chefId, rating`, output `userId: [recommendedChefIds]` for each user.

The process at a high level is:
* compute sorted pairwise cosine similarity matrix between users
* get top K similar users for each user
* get top N rated chefs from those K similar users
* recommend those chefs

We cache the pariwise similarities so each time a new rating is added, instead of recomputing the entire matrix (a very expensive operation), we update the similarities that only need updating.

We also use sparse matrices for our calculations because user-based collaborative filtering is bound to be a sparse problem.

### Setup
TODO: set up `docker-compose.yml` for Python, Kafka, and Redis containers

Or you can install Kafka, Redis, and Python 3.6 and `pip install -r requirements.txt` and run it locally.

### Testing
1. Install pytest, pytest-coverage
```pip install pytest
pip install pytest-cov
```
2. In reco.py, comment out line 183
```
self.redis_cache.set(str(user_id), json.dumps(list(map(int, top_recs))))
```
3. Run
```
cd gobble/reco
pytest
```

## Frontend Setup
Run

```bash
cd frontend
npm install
npm start
```

Will be running on localhost:3000.
