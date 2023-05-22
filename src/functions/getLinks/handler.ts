import { getUserLinksQuery } from "src/services/dynamoDB";
import { createDefaultError } from "src/utils/errors";
import { createResponse } from "src/utils/response";
import { middyfyPrivate } from "@libs/lambda";

import {
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
  APIGatewayEvent,
} from "aws-lambda";

const getLinks: APIGatewayProxyHandler = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const { email: userId } = event.requestContext.authorizer.user;

    const links = await getUserLinksQuery(userId);

    return createResponse(200, {
      links: links.Items.map(
        ({ id, expiresIn, createdAt, visits, isActive }) => {
          return {
            id,
            link: `${process.env.API_URL}${id}`,
            expiresIn,
            createdAt,
            visits,
            isActive,
          };
        }
      ),
    });
  } catch (error) {
    return createDefaultError(error.message);
  }
};

export const main = middyfyPrivate(getLinks);
