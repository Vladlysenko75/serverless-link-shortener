import { SQSEvent } from "aws-lambda";
import { SES } from "aws-sdk";

import { createDefaultError } from "src/utils/errors";

export const main = async (event: SQSEvent) => {
  try {
    const emailAddress = process.env.EMAIL;
    const ses = new SES();

    for (const record of event.Records) {
      const message = JSON.parse(record.body);

      const { recipient, link } = message;

      const params: SES.SendEmailRequest = {
        Destination: {
          ToAddresses: [recipient],
        },
        Message: {
          Body: {
            Text: {
              Data: `Your link ${link} has been deactivated`,
            },
          },
          Subject: {
            Data: "Link expired",
          },
        },
        Source: emailAddress,
      };

      await ses.sendEmail(params).promise();
    }
  } catch (error) {
    return createDefaultError(error.message);
  }
};
