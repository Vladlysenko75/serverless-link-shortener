import { MiddlewareObj } from "@middy/core";

import { createErrorResponse } from "src/utils/errors";
import { getItemFromDB } from "src/services/dynamoDB";
import { verifyToken } from "src/utils/auth";

export const authMiddleware: MiddlewareObj<any, any> = {
  before: async (handler) => {
    try {
      const authHeader = handler.event.headers["Authorization"];
      if (!authHeader) {
        return createErrorResponse(401, "Authorization header missing");
      }

      const token = authHeader.split(" ")[1];
      if (!token) {
        return createErrorResponse(401, "Token not provided");
      }

      const { email } = await verifyToken(token);

      const user = await getItemFromDB("users", { email });

      if (user.Item.token !== token)
        return createErrorResponse(401, "Invalid or expired token");

      handler.event.requestContext.authorizer = { user: { email } };

      return;
    } catch (error) {
      return createErrorResponse(401, "Invalid or expired token");
    }
  },
};
