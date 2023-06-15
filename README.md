# BiteSpeed API

If don't want to follow the steps given below and just want to explore the final output then this application is hosted on AWS ec2 instance. You can hit the [Swagger URL](http://13.127.176.145:8000/Doc) to play with APIs.

**_Getting Started_**

- **Clone the repository**

  > git clone https://github.com/ravi31srv/Identity-Reconciliation.git

- **Switch to the repo folder**

  > cd Identity-Reconciliation

- **Install dependencies**

  > npm install

- **Add .env file at the root level of direcory**

.env file example

```Dotenv
PORT=8000
DB_PORT=3306
DB_HOST='localhost:3306'
DB_USERNAME='YOUR_USERNAME'
DB_PASSWORD='YOUR_PASSWORD'
DB_NAME='YOUR_DATABASE_NAME'


```

- After installing dependencies & adding required env variables in .env file start the application using following command :

  > npm run start


- **Swagger Documentation**

  This project uses the Nestjs swagger module for API documentation.
  [Documentation URL](http://13.127.176.145:8000/Doc)


