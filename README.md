# ride-request-mvp
Initial repository to create the ride request MVP
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
