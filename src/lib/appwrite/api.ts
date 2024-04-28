import { INewPost, INewUser, IUpdatePost, IUpdateUser } from "@/types";
import { account, avatars, databases, storage } from "./config";
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
    const session = await account.createEmailSession(user.email, user.password);
    return session;
  } catch (error) {
    console.log(error);
  }
}

export async function getCurrentUser() {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) {
      throw Error;
    }

    const id = currentAccount.$id;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", [id])]
    );

    if (!currentUser) {
      throw Error;
    }

    return currentUser.documents[0];
  } catch (error) {
    console.error(error);
  }
}

export async function signOutAccount() {
  try {
    const session = await account.deleteSession("current");
    return session;
  } catch (error) {
    console.log(error);
  }
}

export async function createPost(post: INewPost) {
  try {
    // upload image to storage
    const uploadedFile = await uploadFile(post.file[0]);

    if (!uploadedFile) {
      throw Error;
    }

    // get file url
    const fileUrl = getFilePreview(uploadedFile.$id);

    if (!fileUrl) {
      deleteFile(uploadedFile.$id);
      throw Error;
    }

    // convert tags into array.
    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      ID.unique(),
      {
        creator: post.userId,
        caption: post.caption,
        imageUrl: fileUrl,
        imageId: uploadedFile.$id,
        location: post.location,
        tags: tags,
      }
    );

    if (!newPost) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }

    return newPost;
  } catch (error) {
    console.log(error);
  }
}

export async function uploadFile(file: File) {
  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      file
    );

    return uploadedFile;
  } catch (error) {
    console.log(error);
  }
}

export function getFilePreview(fileId: string) {
  try {
    const fileUrl = storage.getFilePreview(
      appwriteConfig.storageId,
      fileId,
      2000,
      2000,
      "top",
      100
    );

    return fileUrl;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteFile(fileId: string) {
  try {
    await storage.deleteFile(appwriteConfig.storageId, fileId);

    return { status: "ok" };
  } catch (error) {
    console.log(error);
  }
}

export async function getRecentPosts() {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(20)]
    );

    if (!posts) {
      throw Error;
    }

    return posts;
  } catch (Error) {
    console.log(Error);
  }
}

export async function likePost(postId: string, likesArray: string[]) {
  try {
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId,
      {
        likes: likesArray,
      }
    );

    if (!updatedPost) throw Error;

    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}

// save post
export async function savePost(postId: string, userId: string) {
  try {
    const updatedPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      ID.unique(),
      {
        user: userId,
        post: postId,
      }
    );

    if (!updatedPost) throw Error;
    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}

// delete saved post
export async function deleteSavedPost(savedRecordId: string) {
  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      savedRecordId
    );

    if (!statusCode) throw Error;
    return { status: "Ok" };
  } catch (error) {
    console.log(error);
  }
}

export async function getPostById(postId: string) {
  try {
    const post = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    );

    if (!post) throw Error;

    return post;
  } catch (error) {
    console.log(error);
  }
}

export async function updatePost(post: IUpdatePost) {
  const hasFileToUpdate = post.file.length > 0;

  try {
    let image = {
      imageUrl: post.imageUrl,
      imageId: post.imageId,
    };

    if (hasFileToUpdate) {
      // upload image to storage
      const uploadedFile = await uploadFile(post.file[0]);

      if (!uploadedFile) {
        throw Error;
      }

      const fileUrl = getFilePreview(uploadedFile.$id);

      if (!fileUrl) {
        deleteFile(uploadedFile.$id);
        throw Error;
      }

      image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
    }

    // convert tags into array.
    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      post.postId,
      {
        caption: post.caption,
        imageUrl: image.imageUrl,
        imageId: image.imageId,
        location: post.location,
        tags: tags,
      }
    );

    if (!updatedPost) {
      await deleteFile(post.imageId);
      throw Error;
    }

    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}

export async function deletePost(postId: string, imageId: string) {
  try {
    if (!postId || !imageId) throw Error;

    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    );

    return { status: "Ok" };
  } catch (error) {
    console.log(error);
  }
}

export async function getInfinitePosts({ pageParam }: { pageParam: string }) {
  const queries = [Query.orderDesc("$updatedAt"), Query.limit(2)];

  if (pageParam !== "0") {
    queries.push(Query.cursorAfter(pageParam));
  }

  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      queries
    );

    if (!posts) throw Error;
    return posts;
  } catch (error) {
    console.log(error);
  }
}

export async function searchPosts(searchTerm: string) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.search("caption", searchTerm)]
    );

    if (!posts) throw Error;

    return posts;
  } catch (error) {
    console.log(error);
  }
}

export async function getUsers(limit?: number) {
  try {
    const users = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      limit
        ? [Query.orderDesc("$createdAt"), Query.limit(limit)]
        : [Query.orderDesc("$createdAt")]
    );

    if (!users) throw Error;

    return users;
  } catch (error) {
    console.log(error);
  }
}

export async function getUserById(id: string | undefined) {
  try {
    if (!id) throw Error;

    const user = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      id
    );

    if (!user) throw Error;

    return user;
  } catch (error) {
    console.log(error);
  }
}

export async function updateUser(profileDetails: IUpdateUser) {
  try {
    console.log(profileDetails);
    const hasFileToUpdate = profileDetails.file.length > 0;
    // let uploadedFile;
    if (hasFileToUpdate) {
      // upload image to storage
      const uploadedFile = await uploadFile(profileDetails.file[0]);

      if (!uploadedFile) {
        throw Error;
      }

      // get file url
      const fileUrl = getFilePreview(uploadedFile.$id);

      if (!fileUrl) {
        deleteFile(uploadedFile.$id);
        throw Error;
      }

      const updatedPost = await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        profileDetails.userId,
        {
          name: profileDetails.name,
          bio: profileDetails.bio,
          imageId: uploadedFile.$id,
          imageUrl: fileUrl,
        }
      );

      console.log(updatePost);
      if (!updatedPost) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }

      console.log("updated:", updatePost);
      return updatedPost;
    }

    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      profileDetails.userId,
      {
        name: profileDetails.name,
        bio: profileDetails.bio,
      }
    );

    if (!updatePost) throw Error;

    console.log("updated:", updatePost);
    return updatedPost;
  } catch (Error) {
    console.error(Error);
  }
}
