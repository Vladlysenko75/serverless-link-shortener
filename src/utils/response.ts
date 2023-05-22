import { APIGatewayProxyResult } from "aws-lambda";

export const createResponse = (
  statusCode: number,
  body: object
): APIGatewayProxyResult => {
  return {
    statusCode,
    body: JSON.stringify(body),
  };
};

export const redirect = (link: string): APIGatewayProxyResult => {
  return {
    statusCode: 302,
    headers: { Location: link },
    body: "",
  };
};
