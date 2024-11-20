'use server';

import { Account, Databases, Client, Storage, Avatars } from "node-appwrite";
import { appwriteConfig } from "./config";
import { cookies } from "next/headers";

export const createSessionClient = async () => {
  // client will be used to initialize instances & services like databases & accounts ensuring
  // they stay connected to the same appwrite account
  const client = new Client()
    .setEndpoint(appwriteConfig.endpointUrl)
    .setProject(appwriteConfig.projectId);

  const session = (await cookies()).get("appwrite-session");

  if (!session || !session.value) {
    throw new Error("No session");
  }

  client.setSession(session.value);

  return {
    get account() {
      return new Account(client);
    },
    get databases() {
      return new Databases(client);
    },
  };
};

// this creates a client instance with admin level permissions to manage ur entire appwrite project
// we're gonna only use it on the server, when we need to create users, manage databases or handle
// tasks that need higher level of access
export const createAdminClient = async () => {
  const client = new Client()
    .setEndpoint(appwriteConfig.endpointUrl)
    .setProject(appwriteConfig.projectId).setKey(appwriteConfig.secretKey);

  return {
    get account() {
      return new Account(client);
    },
    get databases() {
      return new Databases(client);
    },
    get storage() {
        return new Storage(client);
    },
    get avatars() {
        return new Avatars(client);
    }
  };
};
