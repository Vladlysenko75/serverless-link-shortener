import { createDefaultError, createErrorResponse } from "src/utils/errors";
import { getItemFromDB, putItemInDB } from "src/services/dynamoDB";
import { createPassword, generateToken } from "src/utils/auth";
import { createResponse } from "src/utils/response";
import { middyfy } from "@libs/lambda";
import { User } from "@types";

import {
  APIGatewayProxyResult,
  APIGatewayProxyHandler,
  APIGatewayEvent,
} from "aws-lambda";

const signup: APIGatewayProxyHandler = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const { email, password } = event.body as unknown as User;

    const registeredUser = await getItemFromDB("users", { email });

    if (registeredUser.Item)
      return createErrorResponse(
        409,
        `User with email ${email} already exists.`
      );

    const hashedPassword = createPassword(password);

    const token = generateToken({ email });

    const User = {
      email,
      password: hashedPassword,
      token,
      createdAt: new Date().toISOString(),
    };

    await putItemInDB("users", User);

    return createResponse(200, { token });
  } catch (error) {
    return createDefaultError(error.message);
  }
};

export const main = middyfy(signup);
