# ride-request-mvp

## Installation Steps

### Install project packages

#### Install Node/npm (if not present):

(On Linux - if using Homebrew, please utilize appropriate package manager commands)
* `sudo apt update`
* `sudo apt install npm nodejs`

#### Install packages
* `npm install`

### Set up database

#### Create database on MongoDB
* Create an account on MongoDB Atlas. Set it up as a Free learning
account.
* On the MongoDB Atlas web interface, create a new project (such as "ride-request-mvp"). Be sure to save the name and password of the user you create!
* Create a cluster - For ease, name it "TransportationAppCluster".

#### Get project credentials

* Select your cluster, click connect, choose Drivers
* Copy the entire connection string

#### Save credentials to project

* If you don't already have a .env file at the root of the repo, create one. This is for sensitive info and is ignored by git.
* In the .env file, add the following line:
    `MONGODB_URI="YOUR_CONNECTION_STRING"`
    replacing YOUR_CONNECTION_STRING with the connection string you copied from Atlas.
* Toward the beginning of the connection string is a part reading `<db_password>`. Replace this with the user password you created a few steps ago.

## Start The Application

* In the root directory of the repo, type `npm run dev`

Then point your web browser at http://localhost:3001/, or whichever URL is displayed in the terminal.

## Troubleshooting

### You get an error like this in the terminal: `listen EADDRINUSE: address already in use :::5000`
The database API runs separately on port 5000, but in this case some process on your machine is already using that port.

Direct the app to use an alternate port by adding this line to your .env file:
`PORT=5001`, using 5001 as written or some other port number.

Then, in the file client/vite.config.js, change the port on the "target" field to match the new port number. (Please don't commit this change! :D)