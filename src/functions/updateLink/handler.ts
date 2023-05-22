import { createDefaultError, createErrorResponse } from "src/utils/errors";
import { updateItemInDB } from "src/services/dynamoDB";
import { getItemFromDB } from "src/services/dynamoDB";
import { createResponse } from "src/utils/response";
import { middyfyPrivate } from "@libs/lambda";
import { Active } from "@types";

import {
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
  APIGatewayEvent,
} from "aws-lambda";

export const updateLink: APIGatewayProxyHandler = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const id = event.pathParameters.linkId;
    const { isActive } = event.body as unknown as Active;

    const shortLink = await getItemFromDB("links", { id });

    const link = shortLink.Item;

    if (!link)
      return createErrorResponse(404, "Link does not exist or expired.");

    await updateItemInDB("links", { id }, "SET isActive = :isActive", {
      ":isActive": isActive,
    });

    return createResponse(200, { linkId: id, isActive });
  } catch (error) {
    return createDefaultError(error.message);
  }
};

export const main = middyfyPrivate(updateLink);
