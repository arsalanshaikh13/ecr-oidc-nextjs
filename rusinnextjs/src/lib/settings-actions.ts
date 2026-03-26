"use server";

import { auth } from "@/lib/auth";
import {
  AdminUpdateUserAttributesCommand,
  CognitoIdentityProviderClient,
  GetUserAttributeVerificationCodeCommand,
  VerifyUserAttributeCommand,
  AdminSetUserPasswordCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { headers } from "next/headers";
import { MongoClient, ObjectId } from "mongodb";
import { verifySession } from "./dal";

const client = new CognitoIdentityProviderClient({
  region: process.env.COGNITO_REGION,
});

export async function updateProfileAction(data: {
  name?: string;
  email?: string;
}): Promise<{ success: boolean; message: string }> {
  let mongoClient: MongoClient | null = null;
  try {
    const { user } = await verifySession();

    if (!user) {
      throw new Error("Unauthorized");
    }

    const userAttributes = [];
    if (data.name) {
      userAttributes.push({ Name: "name", Value: data.name });
    }
    if (data.email) {
      userAttributes.push({ Name: "email", Value: data.email });
    }

    if (userAttributes.length === 0) {
      throw new Error("No data to update");
    }

    const command = new AdminUpdateUserAttributesCommand({
      UserPoolId: process.env.COGNITO_USER_POOL_ID || "",
      Username: user.username,
      UserAttributes: userAttributes,
    });

    await client.send(command);

    // If email has value and AdminUpdateUserAttributesCommand is successful,
    // update user email and set emailVerified to false in MongoDB
    if (data.email) {
      mongoClient = new MongoClient(process.env.MONGODB_URI!);
      await mongoClient.connect();
      const db = mongoClient.db();

      await db.collection("user").updateOne(
        { _id: new ObjectId(user.id) },
        {
          $set: {
            email: data.email,
            emailVerified: false,
          },
        },
      );
    }

    return {
      success: true,
      message: "Profile updated successfully!",
    };
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error("Failed to update profile");
  } finally {
    if (mongoClient) {
      await mongoClient.close();
    }
  }
}

export async function confirmEmailAction(code: string): Promise<{
  success: boolean;
  message: string;
}> {
  let mongoClient: MongoClient | null = null;
  try {
    const headersList = await headers();
    const { user } = await verifySession();

    if (!user) {
      throw new Error("Unauthorized");
    }

    const tokens = await auth.api.getAccessToken({
      body: {
        providerId: "cognito",
      },
      headers: headersList,
    });

    await client.send(
      new VerifyUserAttributeCommand({
        AccessToken: tokens.accessToken,
        AttributeName: "email",
        Code: code,
      }),
    );

    // If email confirmed successfully, update emailVerified to true in MongoDB
    mongoClient = new MongoClient(process.env.MONGODB_URI!);
    await mongoClient.connect();
    const db = mongoClient.db();

    await db.collection("user").updateOne(
      { _id: new ObjectId(user.id) },
      {
        $set: {
          emailVerified: true,
        },
      },
    );

    return {
      success: true,
      message: "Email verified successfully",
    };
  } catch (error) {
    throw error instanceof Error ? error : new Error("Failed to verify email");
  } finally {
    if (mongoClient) {
      await mongoClient.close();
    }
  }
}

export async function resendVerificationEmailAction(): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const headersList = await headers();
    const { user } = await verifySession();

    if (!user) {
      throw new Error("Unauthorized");
    }

    const tokens = await auth.api.getAccessToken({
      body: {
        providerId: "cognito",
      },
      headers: headersList,
    });

    await client.send(
      new GetUserAttributeVerificationCodeCommand({
        AccessToken: tokens.accessToken,
        AttributeName: "email",
      }),
    );

    return {
      success: true,
      message: "Verification email sent successfully!",
    };
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error("Failed to send verification email");
  }
}

export async function updatePasswordAction(data: {
  password: string;
}): Promise<{ success: boolean; message: string }> {
  try {
    const { user } = await verifySession();

    if (!user) {
      throw new Error("Unauthorized");
    }

    if (!data.password || data.password.length < 8) {
      throw new Error("Password must be at least 8 characters long");
    }

    const command = new AdminSetUserPasswordCommand({
      UserPoolId: process.env.COGNITO_USER_POOL_ID || "",
      Username: user.username,
      Password: data.password,
      Permanent: true,
    });

    await client.send(command);

    return {
      success: true,
      message: "Password updated successfully!",
    };
  } catch (error) {
    console.log(error);
    throw error instanceof Error
      ? error
      : new Error("Failed to update password");
  }
}
