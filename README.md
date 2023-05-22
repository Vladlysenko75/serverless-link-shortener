# Serverless - AWS Node.js Typescript

This project has been generated using the `aws-nodejs-typescript` template from the [Serverless framework](https://www.serverless.com/).

For detailed instructions, please refer to the [documentation](https://www.serverless.com/framework/docs/providers/aws/).

## Installation/deployment instructions

- Step 1: Create .env.dev file in root directory.

- Step 2: Open verifyEmail.mjs, insert `region` for SES config and provide email from which `emails` would be sent. Be sure that in serverless.yml providers.region is the same.

- Step 3: Run `npm i` to install the project dependencies.

- Step 4: Be sure you have installed `AWS CLI` with set up account. If not - install and run `aws configure` to provide your AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY.

- Step 5: Run `sls deploy` to deploy this stack to AWS.

- Step 6: Open your mail and open link from AWS SES to verify email.

- Step 7: After deployment you will see logs with endpoints for `SWAGGER` documentation and endpoint created with CloudFormation for your main App. Copy endpoint to main App and add `API_URL` env with it to .env.dev. If you lost App endpoints logs, run `sls info`.

- Step 8: Run `sls deploy` again. Now API_URL env would be updated and you can start using application. Check documentation for usage.

If you need to remove everything run `sls remove`.

### Locally

To run locally `npm run local`

### Project structure

The project code base is mainly located within the `src` folder. This folder is divided in:

- `functions` - containing code base and configuration for your lambda functions
- `libs` - containing shared code base between your lambdas

### 3rd party libraries

- [json-schema-to-ts](https://github.com/ThomasAribart/json-schema-to-ts) - uses JSON-Schema definitions used by API Gateway for HTTP request validation to statically generate TypeScript types in your lambda's handler code base
- [middy](https://github.com/middyjs/middy) - middleware engine for Node.Js lambda. This template uses [http-json-body-parser](https://github.com/middyjs/middy/tree/master/packages/http-json-body-parser) to convert API Gateway `event.body` property, originally passed as a stringified JSON, to its corresponding parsed object
- [@serverless/typescript](https://github.com/serverless/typescript)
