# ride-request-mvp

## Installation Steps

(On Linux - if using Homebrew, please utilize appropriate commands)
* sudo apt update
* sudo apt install npm nodejs
* npm install
* node server/index.js

Create an account on MongoDB Atlas. Set it up as a Free learning
account. Pick Node.js and create database user, then Select Drivers
and you'll get the connection string and password you need to copy.

Optional: npm install mongodb

## MongoDB Instructions

Switching MongoDB Accounts:
* Log into MongoDB Atlas
* Create a new project (such as "ride-request-mvp")
* Create a cluster - For ease, name it "TransportationAppCluster"
* On menu click "Clusters" then "Browse Collections" for TransportationAppCluster
* Create a database called "database"
* Click the + icon to the right of where it says "database" in the lists of databases. This will create a collection.
* Add collections named "service-providers", "ride-requests", "service-users" - These can be populated later using the forms

Updating the .env file:
* Change the MONGO_URI - In Atlas, go to clusters
* Click connect, choose Drivers
* Copy the connection string
* Paste the string as the MONGO_URI in the .env - Note that you will need to fill in the <db_password> in the string, this will be given to you when you make the cluster, so keep it somewhere
* The database name variable in the .env should remain "database" unless you choose to change it