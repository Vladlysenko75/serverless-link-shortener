import { createDefaultError, createErrorResponse } from "src/utils/errors";
import { checkIfPasswordIsCorrect, generateToken } from "src/utils/auth";
import { getItemFromDB, updateUserToken } from "src/services/dynamoDB";
import { createResponse } from "src/utils/response";
import { middyfy } from "@libs/lambda";
import { User } from "@types";

import {
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
  APIGatewayEvent,
} from "aws-lambda";

const login: APIGatewayProxyHandler = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const { email, password } = event.body as unknown as User;

    const user = await getItemFromDB("users", { email });

    if (!user.Item)
      return createErrorResponse(401, "Invalid username or password");

    const passwordCorrect = checkIfPasswordIsCorrect(
      password,
      user.Item.password
    );

    if (passwordCorrect) {
      const token = generateToken({ email });

      await updateUserToken(email, token);

      return createResponse(200, { token });
    } else {
      return createErrorResponse(401, "Invalid username or password");
    }
  } catch (error) {
    return createDefaultError(error.message);
  }
};

export const main = middyfy(login);
