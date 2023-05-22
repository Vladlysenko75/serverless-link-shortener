import { middyfyPrivate } from "@libs/lambda";
const { v4: uuidv4 } = require("uuid");
import { Scheduler } from "aws-sdk";

import { ExpirationMilliseconds, Expiration, Link } from "@types";
import {
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
  APIGatewayEvent,
} from "aws-lambda";

import { createDefaultError } from "src/utils/errors";
import { putItemInDB } from "src/services/dynamoDB";
import { createResponse } from "src/utils/response";
import { createShortLink } from "src/utils/links";

const createLink: APIGatewayProxyHandler = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const { email: userId } = event.requestContext.authorizer.user;
    const { link, expiresIn } = event.body as unknown as Link;

    const shortLink = createShortLink(link);

    const linkItem = {
      id: shortLink,
      userId,
      sourceLink: link,
      createdAt: new Date().toISOString(),
      isActive: true,
      expiresIn,
      visits: 0,
    };

    await putItemInDB("links", linkItem);

    if (expiresIn !== Expiration.OneTime) {
      let DelayMilliseconds;

      switch (expiresIn) {
        case Expiration.OneMinute:
          DelayMilliseconds = ExpirationMilliseconds.OneMinute;
          break;
        case Expiration.OneDay:
          DelayMilliseconds = ExpirationMilliseconds.OneDay;
          break;
        case Expiration.ThreeDays:
          DelayMilliseconds = ExpirationMilliseconds.ThreeDays;
          break;
        case Expiration.SevenDays:
          DelayMilliseconds = ExpirationMilliseconds.SevenDays;
          break;
        default:
          break;
      }

      const scheduler = new Scheduler({
        apiVersion: "2021-06-30",
        region: process.env.REGION,
      });

      const currentDate = Date.now();

      const futureDate = currentDate + DelayMilliseconds;

      const dateObject = new Date(futureDate);

      const year = dateObject.getFullYear();
      const month = String(dateObject.getMonth() + 1).padStart(2, "0");
      const day = String(dateObject.getDate()).padStart(2, "0");
      const hours = String(dateObject.getHours()).padStart(2, "0");
      const minutes = String(dateObject.getMinutes()).padStart(2, "0");
      const seconds = String(dateObject.getSeconds()).padStart(2, "0");

      const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;

      const scheduleId = uuidv4();

      const params = {
        FlexibleTimeWindow: {
          Mode: "OFF",
        },
        Name: scheduleId,
        ScheduleExpression: `at(${formattedDate})`,
        Target: {
          Arn: `arn:aws:lambda:${process.env.REGION}:${process.env.AWS_ACCOUNT_ID}:function:link-shortener-dev-disableLink`,
          RoleArn: `arn:aws:iam::${process.env.AWS_ACCOUNT_ID}:role/scheduler-event-role`,
          Input: JSON.stringify({ shortLink, userId }),
        },
        State: "ENABLED",
      };

      await scheduler.createSchedule(params).promise();
    }

    return createResponse(200, {
      shortLink: `${process.env.API_URL}${shortLink}`,
    });
  } catch (error) {
    return createDefaultError(error.message);
  }
};

export const main = middyfyPrivate(createLink);
