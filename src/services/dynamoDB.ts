import { DynamoDB } from "aws-sdk";

// const dynamoDB = new DynamoDB.DocumentClient({
//   region: process.env.DB_REGION,
//   endpoint: process.env.DB_ENDPOINT,
// });

const dynamoDB = new DynamoDB.DocumentClient();

export const putItemInDB = async (
  tableName: string,
  item: object
): Promise<void> => {
  const params: AWS.DynamoDB.DocumentClient.PutItemInput = {
    TableName: tableName,
    Item: item,
  };

  await dynamoDB.put(params).promise();
};

export const getItemFromDB = async (
  tableName: string,
  key: object
): Promise<any> => {
  const params: AWS.DynamoDB.DocumentClient.GetItemInput = {
    TableName: tableName,
    Key: key,
  };

  return await dynamoDB.get(params).promise();
};

export const updateItemInDB = async (
  tableName: string,
  key: object,
  updateExpression: string,
  expressionAttributeValues: any
): Promise<void> => {
  const params: AWS.DynamoDB.DocumentClient.UpdateItemInput = {
    TableName: tableName,
    Key: key,
    UpdateExpression: updateExpression,
    ExpressionAttributeValues: expressionAttributeValues,
  };

  await dynamoDB.update(params).promise();
};

export const deleteItem = async (
  tableName: string,
  key: object
): Promise<void> => {
  const params: AWS.DynamoDB.DocumentClient.DeleteItemInput = {
    TableName: tableName,
    Key: key,
  };

  await dynamoDB.delete(params).promise();
};

export const updateUserToken = async (
  email: string,
  token: string
): Promise<void> => {
  const params: AWS.DynamoDB.DocumentClient.UpdateItemInput = {
    TableName: "users",
    Key: { email },
    UpdateExpression: "SET #token = :newToken",
    ExpressionAttributeValues: {
      ":newToken": token,
    },
    ExpressionAttributeNames: { "#token": "token" },
  };

  await dynamoDB.update(params).promise();
};

export const getUserLinksQuery = async (userId: string) => {
  const params = {
    TableName: "links",
    IndexName: "UserIdIndex",
    KeyConditionExpression: "#userId = :userId",
    FilterExpression: "attribute_not_exists(deletedAt)",
    ExpressionAttributeNames: {
      "#userId": "userId",
    },
    ExpressionAttributeValues: {
      ":userId": userId,
    },
  };

  const result = await dynamoDB.query(params).promise();

  return result;
};
