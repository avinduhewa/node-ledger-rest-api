# :Different Ledger Rest API

## Assumptions
- All parameters in the ledger creation endpoint are mandatory
- The endpoint requires a valid JWT token (manually generated for now since authentication is not implemented)
- if calculating for monthly frequency the start date is the first day of the month the end date will be the last day of that month
- if calculating for monthly frequency the start day is the last of the month the end date will be the last day of the following month

_PS: since the `ledger.service` doesnt maintain a state and simply transforms the input a functional programming approach has been applied_

## Pre-Requisites

- Node.js v12 or above
- Yarn package manager installed

## Setting up the project

1. Clone the Repository and Change into the project directory
2. Run `yarn install` to install the package dependencies 
3. Run `yarn setup:env:bash` or `yarn setup:env:cmd` (if on windows) to copy the initial environment variables
4. The application can be run by executing `yarn start`
5. You can use `yarn dev` to run the API in development mode

_PS: Swagger is only available if you run in `development` mode_


## Generate a token

- Run the command `yarn token:generate` to generate a JWT token and copy the generated token for future use
## Calling the API

- Swagger Documentation can be used to test the API using `http://localhost:3000/api/docs` 
- make sure you add the generated token using the `Authorize` button in swagger
- The ledger generation endpoint is `GET` `/api/accounting/ledger` , the parameter information is provided in the documentation

- You can also test the API using CURL by using the following command (just make sure to add the corect parameters)

**NOTE: replace the `{token}` with the token value you generated earlier before runnning the following curl command**

```curl -X 'GET' \ 'http://localhost:3000/api/accounting/ledger?start_date=2022-01-01T00:00:00+0000&end_date=2022-02-01T00:00:00+0000&frequency=WEEKLY&weekly_rent=300&timezone=Asia/Colombo' \ -H 'accept: application/json' \ -H 'Authorization: Bearer {token}'```

## Testing

There are two types of tests written. There is a unit test for the `ledger.service` and integration tests for the `accounting` routes

- You can run the tests by running the command `yarn test`
- You can check the test covererage by running the command `yarn coverage`

_PS: Tests do not cover all of the middleware functions available_