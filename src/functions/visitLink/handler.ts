import {
  deleteItem,
  getItemFromDB,
  updateItemInDB,
} from "src/services/dynamoDB";

import { createDefaultError, createErrorResponse } from "src/utils/errors";
import { redirect } from "src/utils/response";
import { middyfy } from "@libs/lambda";
import { Expiration } from "@types";

import {
  APIGatewayProxyResult,
  APIGatewayProxyHandler,
  APIGatewayEvent,
} from "aws-lambda";

const visitLink: APIGatewayProxyHandler = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const id = event.pathParameters.linkHash;

    const shortLink = await getItemFromDB("links", { id });

    const link = shortLink.Item;

    if (!link)
      return createErrorResponse(404, "Link does not exist or expired.");

    const sourceLink = link.sourceLink;

    let updateExpression;
    let expressionAttributeValues;

    if (link.expiresIn === Expiration.OneTime) {
      await deleteItem("links", { id });
    } else {
      updateExpression = "SET visits = visits + :increment";
      expressionAttributeValues = { ":increment": 1 };
    }

    await updateItemInDB(
      "links",
      { id },
      updateExpression,
      expressionAttributeValues
    );

    return redirect(sourceLink);
  } catch (error) {
    return createDefaultError(error.message);
  }
};

export const main = middyfy(visitLink);
