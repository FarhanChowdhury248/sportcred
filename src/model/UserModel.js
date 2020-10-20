import { auth, firestore, storage} from '../firebase.js';
import React from 'react';


export default class UserModel {
  static userDocObj = {
    display_name: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    is_active: true,
    last_login: null,
    profile: {},
    profile_completed: false,
    questionnaire_completed: false,
    questionnaire_responses: {}
  };

  static async updateProfilePicture(filepath: string, uid: string, success, failure) {
    let reference = storage().ref(`profile_pictures/${uid}`);
    await reference.putFile(filepath).catch((error) => failure(error));
    const url = await reference.getDownloadURL().catch((error) => failure(error));

    auth().currentUser.updateProfile({
      photoURL: url
    }).then(success()).catch(failure(error));
  }

  /**
   *  Returns user object. Refer to firebase for schema
   *
   * @param uid
   * @returns {{}} userobject
   */
  static getUserDoc(uid: string) {
    this._fetchUserDoc(uid);
    return this.userDocObj;
  }

  static _fetchUserDoc(uid: string) {
    const reference = firestore().collection('users').doc(uid);
    reference.get().then(
        (doc) => {
          this.userDocObj = doc.data();
        }
    );
  }


  /**
   * Which first time tasks are required to be complete.
   * 2 = questionnaire and profile biography
   * 1 = profile biography
   * 0 = user is ready
   *
   * @param uid
   * @returns {number}
   */
  static firstTimeLoginChecks(uid: string) {
    this._fetchUserDoc(uid);
    let stack = 0;
    if (!this.userDocObj.profile_completed)
      stack++;
    if (!this.userDocObj.questionnaire_completed)
      stack++;

    return stack
  }

  static createNewUserDoc(uid, display_name, callback = null) {
    this.userDocObj.display_name = display_name;
    this.userDocObj.uid = uid;
    firestore().collection('users').add(this.userDocObj).then(callback());
  }

  static updateDisplayName(uid, displayName, callback = null) {
    const fp = "display_name";
    firestore().collection('users').doc(uid).update({fp: displayName}).then(callback());
  }

  static updateProfile(uid, profile, callback = null) {
    const fp = "profile";
    firestore().collection('users').doc(uid).update({fp: profile}).then(callback());
  }

  static updateQuestionnaire(uid, questionnaire, callback = null) {
    const fp = "questionnaire_responses";
    firestore().collection('users').doc(uid).update({fp: questionnaire}).then(callback());
  }

  /**
   * Register a user with email/password.
   *
   * @param email         {string}    User email
   * @param password      {string}    User password (safe to use plaintext)
   * @param success     {function}    Success callback (should be no params)
   * @param failure     {function}    Failure callback (single param). Format should be failure(error: Object). Error object contains a "code" field of type String. e.g. error.code may return 'auth/invalid-email'
   */
  static createUserWithEmailAndPassword(email, password, success, failure) {
    auth()
      .createUserWithEmailAndPassword(email, password, success, failure)
      .then(() => {
        success();
      })
      .catch((error) => {
        failure(error);
      });
  }

  /**
   * Once successfully created and/or signed in, any onAuthStateChanged listeners will trigger an event with the user parameter being a null value.
   *
   * @param {function}    success    Optional callback function (no params).
   */
  static signOut(success = null) {
    auth()
      .signOut()
      .then(() => {
        typeof success === 'function' && success(); // optional callback
      });
  }

  /**
   * WIP____________ [Sign a user in with email/password.].
   *
   * @param email         {string}    User email
   * @param password      {string}    User password (safe to use plaintext)
   * @param success     {function}    Success callback (should be no params)
   * @param failure     {function}    Failure callback (single param). Format should be failure(error: Object). Use "error.code" and "error.message"
   */
  static signInWithEmailAndPassword(email, password, success, failure) {
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        success();
      })
      .catch((error) => {
        failure(error);
      });
  }

  static getAuthSubscriber(onAuthStateChanged) {
    return auth().onAuthStateChanged(onAuthStateChanged);
  }
}
