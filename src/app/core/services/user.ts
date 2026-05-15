import { Injectable, inject } from '@angular/core';

import {
  Firestore,
  collection,
  collectionData,
  doc,
  docData,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  getDoc
} from '@angular/fire/firestore';

import {
  Observable
} from 'rxjs';

import {
  AppUser
} from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private firestore = inject(Firestore);

  private usersCollection = collection(
    this.firestore,
    'users'
  );

  //get all users. This method retrieves all user documents from the 'users' collection in Firestore. It uses the collectionData function to listen for real-time updates, returning an Observable of an array of AppUser objects. Each user document includes an 'id' field for easy identification, allowing components to display and manage user data effectively.
  getUsers(): Observable<AppUser[]> {
    return collectionData(
      this.usersCollection,
      { idField: 'id' }
    ) as Observable<AppUser[]>;
  }

  //get user by ID. This method retrieves a user's document from Firestore based on the provided user ID. It uses the doc and docData functions to access the specific document in the 'users' collection and returns an Observable of the AppUser type, allowing for real-time updates if the user's data changes in Firestore.
  getUserById(id: string): Observable<AppUser> {

    const userDoc = doc(
      this.firestore,
      `users/${id}`
    );

    return docData(
      userDoc,
      { idField: 'id' }
    ) as Observable<AppUser>;
  }

 //create new user. This method adds a new user document to the Firestore database. It requires a complete AppUser object with all necessary fields (id, username, email, role). The method uses the setDoc function to create the document in the 'users' collection, setting the createdAt and updatedAt timestamps to the current server time. If any required fields are missing, it throws an error to ensure data integrity. Upon successful creation, it returns the ID of the newly created user.
  async addUser(user: AppUser): Promise<string> {

    if (
      !user.id ||
      !user.username ||
      !user.email ||
      !user.role
    ) {
      throw new Error(
        'Complete user credentials are required.'
      );
    }

    const userDoc = doc(
      this.firestore,
      `users/${user.id}`
    );

    await setDoc(userDoc, {
      username: user.username,
      email: user.email,
      role: user.role,

      residentId: user.residentId || null,

      profileImage: user.profileImage || '',

      activityLogs: [
        {
          action: 'Account created',
          time: new Date()
        }
      ],

      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    return user.id;
  }

  //update user information. This method allows for updating specific fields of a user's document in Firestore. It takes the user ID and a partial AppUser object containing the fields to be updated. The method uses the updateDoc function to apply the changes, ensuring that only the specified fields are modified while preserving the rest of the user's data. Additionally, it updates the updatedAt timestamp to reflect the time of the update, providing a record of when the user's information was last modified.
  async updateUser(
    id: string,
    data: Partial<AppUser>
  ): Promise<void> {

    const userDoc = doc(
      this.firestore,
      `users/${id}`
    );

    await updateDoc(userDoc, {
      ...data,
      updatedAt: serverTimestamp()
    });
  }

  //delete user by ID. This method removes the user's document from Firestore based on the provided user ID. It uses the deleteDoc function to perform the deletion, ensuring that the user's data is permanently removed from the database. This action is irreversible, so it should be used with caution, typically in scenarios such as account deletion or administrative user management.
  async deleteUser(id: string): Promise<void> {

    const userDoc = doc(
      this.firestore,
      `users/${id}`
    );

    await deleteDoc(userDoc);
  }

  //save profile image as base64 string in Firestore. This method takes the user ID and the base64-encoded image string, updates the user's document in Firestore with the new profile image, and returns the base64 string. This allows for easy retrieval and display of the user's profile image across the application without needing to manage separate file storage for images.
  async saveProfileImageAsBase64(
    userId: string,
    base64Image: string
  ): Promise<string> {

    await this.updateUser(userId, {
      profileImage: base64Image
    });

    return base64Image;
  }

  //activity log is a record of user actions with timestamps, stored in the user's document in Firestore. This method adds a new log entry whenever a significant action occurs, such as account creation, profile updates, or other interactions. The logs are stored as an array of objects, each containing an action description and a timestamp. This allows for tracking user activity and can be useful for auditing or monitoring purposes.
  async addActivityLog(
    userId: string,
    action: string
  ): Promise<void> {

    const userDoc = doc(
      this.firestore,
      `users/${userId}`
    );

    const snapshot = await getDoc(userDoc);

    const currentUser = snapshot.data() as AppUser;

    const logs = currentUser.activityLogs || [];

    logs.unshift({
      action,
      time: new Date()
    });

    await updateDoc(userDoc, {
      activityLogs: logs,
      updatedAt: serverTimestamp()
    });
  }

  //resident users are those linked to a resident profile (residentId is not null)
  getResidentUsers(): Observable<AppUser[]> {

    return collectionData(
      this.usersCollection,
      { idField: 'id' }
    ) as Observable<AppUser[]>;
  }
}