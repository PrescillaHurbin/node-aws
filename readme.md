# Node-aws

Rest API hosted on AWS using lambda functions to create or update addresses.  
This Rest API is secured by using an api key.  
The application can be deployed on aws using serverless framework with the serverless.yml  
The database used for this project is dynamodb. 
The application contains some tests using jest framework. 

## How to start the project

1. Copy default.env and add configuration to the .env
``` 
cd addresses-service/
cp default.env .env
```

2. To run the project locally 
``` 
npm run install-db
num run start
```

3. To run tests
``` 
npm run test
```

4. To deploy
``` 
npm run deploy
```