import pkg from "aws-sdk";
const { SES } = pkg;

const ses = new SES({ region: "us-east-1" });

const emailAddress = "vladyslavlysenko75@gmail.com";
const params = {
  Identities: [emailAddress],
};

async function verifyEmailAddress() {
  try {
    const verification = await ses
      .getIdentityVerificationAttributes(params)
      .promise();
    const verificationStatus =
      verification.VerificationAttributes[emailAddress]?.VerificationStatus;

    if (verificationStatus !== "Success") {
      const response = await ses
        .verifyEmailAddress({
          EmailAddress: emailAddress,
        })
        .promise();
      console.log(`Verification email sent to ${emailAddress}.`);
    } else {
      console.log(`${emailAddress} is already verified.`);
    }
  } catch (error) {
    console.error(`Failed to verify ${emailAddress}:`, error);
  }
}

verifyEmailAddress();
