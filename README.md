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
