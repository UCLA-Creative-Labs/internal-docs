import firebase from 'firebase';

import { Score } from '../components/Leaderboard';
import { INITIAL_LEVEL } from '../components/Levels';

const config = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.DATABASE_URL,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID,
};
const app = firebase.initializeApp(config);

/**
 * The UserInfo that the app needs to process levels
 */
export interface UserInfo {
  name?: string;
  email?: string;
  level?: string;
  score?: number;
}

/**
 * The class to perform operations on Firebase
 */
export class _Firebase {
  /**
   * user info will be stored here
   */
  public user?: UserInfo;
  /**
   * the authenticated user information
   *
   * Used for the firebase CRUD operations
   */
  protected auth_user?: firebase.User;

  /**
   * When component mounts, run this function.
   *
   * 1. Set the persistence for the firebase.app to persist locally
   * 2. Sign in the user and store the auth_user
   * 3. Update this.user with through a POST
   */
  public load(success: (...args: any[]) => void, fail: (...args: any[]) => void): void {
    void firebase
      .auth(app)
      .setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    firebase.auth(app).onAuthStateChanged((user: firebase.User | null) => {
      if (user) {
        this.auth_user = user;
        void (!this.user || Object.keys(this.user).length === 0
          ? this.postUser()
          : this.getUser()
        ).then((userData) => {
          this.user = userData;
          success();
        });
      } else {
        fail();
      }
    });
  }

  /**
   * @returns the UI Configuration for StyledFirebaseAuth
   */
  public uiConfig(): firebaseui.auth.Config {
    return {
      signInFlow: 'popup',
      signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      ],
      callbacks: {
        signInSuccessWithAuthResult: () => {
          return false;
        },
      },
    };
  }

  /**
   * @returns the firebase.app
   */
  public auth(): firebase.auth.Auth {
    return firebase.auth(app);
  }

  /**
   * Sign out and empty this.user
   */
  public signOut(): Promise<any> {
    return firebase
      .auth(app)
      .signOut()
      .then(() => (this.user = {}));
  }

  public checkPassword(level: string, guess: string): Promise<boolean | undefined> {
    if (!this.auth_user) return Promise.resolve(undefined);
    return firebase
      .firestore(app)
      .collection('levels')
      .doc(level)
      .get()
      .then((doc) => {
        return doc.exists ? doc.data()?.password === guess : false;
      });
  }

  /**
   * Retrieves the document on a user and perform an operation
   *
   * @param ternaryOp if the document doesnt exist, complete this operation
   */
  protected retrieveDocument(ternaryOp?: (...args: any[]) => any) {
    if (!this.auth_user) return Promise.resolve(undefined);
    const document = firebase
      .firestore(app)
      .collection('users')
      .doc(this.auth_user.uid);
    return document.get().then((doc) => {
      return doc.exists ? doc.data() : ternaryOp && ternaryOp(this.auth_user);
    });
  }

  /**
   * GET operation for scores of top X people.
   */
  public getTopScores(): Promise<Score[] | undefined> {
    if (!this.auth_user) return Promise.resolve(undefined);
    const users = firebase.firestore().collection('users');
    return users.get().then((snapshot) => {
      return snapshot.docs
        .filter((doc) => doc.get('level') !== 'admin' && doc.get('score') > 0)
        .map((doc) => ({
          name: doc.get('name'),
          level: doc.get('level'),
          score: doc.get('score'),
        }))
        .sort(function (a, b) {
          return (b.score || 0) - (a.score || 0);
        })
        .slice(0, 10);
    });
  }

  /**
   * GET operation for the user.
   */
  public getUser(): Promise<any> {
    return this.retrieveDocument();
  }

  /**
   * POST operation for the user.
   */
  public postUser(): Promise<any> {
    return this.retrieveDocument(this.putUser);
  }

  /**
   * UPDATE operation for the user.
   *
   * @param updates the updated user object, defaults to this.user if not passed in
   */
  public updateUser(updates: UserInfo): Promise<any> {
    if (!this.auth_user) return Promise.resolve(undefined);
    const document = firebase
      .firestore(app)
      .collection('users')
      .doc(this.auth_user.uid);
    const updatedUser: UserInfo = {
      name: updates.name ?? this.user?.name,
      email: updates.email ?? this.user?.email,
      level: updates.level ?? this.user?.level,
      score: updates.score ?? this.user?.score,
    };
    return document.update(updatedUser).then(() => {
      this.user = updatedUser;
    });
  }

  /**
   * PUT operation for the user.
   */
  public putUser(user: firebase.User): UserInfo {
    if (!user && !this.auth_user) return {};
    const document = firebase
      .firestore(app)
      .collection('users')
      .doc(user.uid ?? this.auth_user?.uid);
    const profile = user.providerData[0];

    const deets: UserInfo = {
      name: profile?.displayName ?? 'Anonymous User',
      email: profile?.email ?? 'N/A',
      level: INITIAL_LEVEL,
      score: 0,
    };
    void document.set(deets);
    return deets;
  }
}
