import { SQS } from "aws-sdk";

import { deleteItem } from "src/services/dynamoDB";

export const main = async (event: any) => {
  try {
    const { userId: recipient, shortLink } = event;

    await deleteItem("links", { id: shortLink });

    const sqs = new SQS();

    const message = {
      recipient,
      link: `${process.env.API_URL}${shortLink}`,
    };

    const messageParams = {
      QueueUrl: `https://sqs.${process.env.REGION}.amazonaws.com/${process.env.AWS_ACCOUNT_ID}/sendNotificationQueue`,
      MessageBody: JSON.stringify(message),
    };

    await sqs.sendMessage(messageParams).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `Link ${process.env.API_URL}${shortLink} disabled successfully`,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error disabling link",
        error: error.message,
      }),
    };
  }
};
