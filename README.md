# ride-request-mvp

## Installation Steps

(On Linux - if using Homebrew, please utilize appropriate commands)
* sudo apt update
* sudo apt install npm nodejs
* node run install all
* node server/index.js

Create an account on MongoDB Atlas. Set it up as a Free learning
account. Pick Node.js and create database user, then Select Drivers
and you'll get the connection string and password you need to copy.

Optional: npm install mongodb

## MongoDB Instructions

Switching MongoDB Accounts:
Log into MongoDB Atlas
Create cluster
For ease, name it “TransportationAppCluster” (that is what mine is now)
Browse collections of the cluster
Create a database called “database”
Click the + icon to the right of where it says “database” in the lists of databases. This will create a collection
Add collections named “providers”, “ride-requests”, “users”
These can be populated later using the forms
Updating the .env file:
Changing the MONGO_URI
(In MongoDB Atlas) Go to clusters
Click connect
Choose Drivers
Copy the connection string
Paste the string as the MONGO_URI in the .env
Note that you will need to fill in the <db_password> in the string, this will be given to you when you make the cluster, so keep it somewhere
The database name variable in the .env should remain “database”, unless you choose to change it
