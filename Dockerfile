FROM node:latest
# RUN mkdir -p /usr/src/app
# WORKDIR /usr/src/app
RUN wget https://bootstrap.pypa.io/get-pip.py
RUN python get-pip.py
RUN pip install pymongo requests
RUN mkdir -p /api
WORKDIR /api
COPY package.json ./
RUN npm install
RUN npm install bcrypt
RUN npm install aws-sdk
RUN npm install amazon-cognito-identity-js
COPY . ./
EXPOSE 8080
CMD [ "npm", "start" ]
