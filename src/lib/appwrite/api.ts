import { INewUser } from "@/types";
import { account, avatars, databases } from "./config";
import { ID, Query } from "appwrite";
import { appwriteConfig } from "./config";

export async function createUserAccount(user: INewUser) {
  //creating newAccount
  try {
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name
    );

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(user.name);

    const newUser = await saveUserToDB({
      accountId: newAccount.$id,
      email: newAccount.email,
      name: newAccount.name,
      imageUrl: avatarUrl,
      username: user.username,
    });

    return newUser;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function saveUserToDB(user: {
  accountId: string;
  email: string;
  name: string;
  imageUrl: URL;
  username?: string;
}) {
  try {
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      user
    );

    return newUser;
  } catch (error) {
    console.log(error);
  }
}

export async function signInAccount(user: { email: string; password: string }) {
  try {
    // creating an email session.
    console.log(account);
    const session = account.createEmailSession(user.email, user.password);
    console.log(session);
    return session;
  } catch (error) {
    console.log(error);
  }
}

export async function getCurrentUser() {
  try {
    const currentAccount = await account.get();

    console.log(currentAccount);

    if (!currentAccount) {
      throw Error;
    }
    const id = currentAccount.$id;

    const query = Query.equal("accountId", [id]);
    console.log(query);
    console.log(id);
    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", [id])]
    );

    console.log(currentUser.documents);

    if (!currentUser) {
      throw Error("no current uer");
    }

    return currentUser.documents[0];
  } catch (error) {
    console.error(error);
  }
}
