import { APIGatewayProxyResult } from "aws-lambda";

export const createErrorResponse = (
  statusCode: number,
  message: string
): APIGatewayProxyResult => {
  return {
    statusCode,
    body: JSON.stringify({ error: message }),
  };
};

export const createDefaultError = (message?: string): APIGatewayProxyResult => {
  return {
    statusCode: 500,
    body: JSON.stringify({ error: message || "Internal server error" }),
  };
};
