## Docker Erasures::
```
docker stop $(docker ps -a -q)
docker rm $(docker ps -a -q)
```

## Intro
This is the backend service for the Gradus application. Documentation on how to utilize this application can be found [here](https://documenter.getpostman.com/view/3079289/S1M2RR11?version=latest).

## Setup
In order to use this application, perform the following operation:
```
npm start
```

## Use
The backend service is currently running on the cloud, [here](http://scantronbackend-env.mzszeithxu.us-west-2.elasticbeanstalk.com). If you would like to perform your own local development, you can utilize the following link, after an `npm start` has been performed, [here](http://localhost:8080)
