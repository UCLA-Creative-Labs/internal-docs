# Firebase

Firebase is a great service that allows us to have complex web applications without
the need for a server. We can use Firebase for authentication, database storage, 
functions, etc. One of the harder parts of using Firebase for web applications is
how to manage the state changes with Firebase. Thankfully, we wrote some code
already to showcase how you can manage it.

## _Firebase Class

We can create a custom object called `_Firebase` that encompasses all of our Firebase
actions. An encompassing object can be used as a `ReactContextProvider` that can be
accessed by all child components.

### Configure your _Firebase class

Intialize your app so that way all Firebase objects follow this configured App.

```ts
import firebase from 'firebase';

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
```

### Define your User's information

Next, define what your user's data will look like, for [`Password`](https://github.com/UCLA-Creative-Labs/password)
our `UserInfo` looked like this:

```ts
/**
 * The UserInfo that the app needs to process levels
 */
export interface UserInfo {
  name?: string;
  email?: string;
  level?: string;
  score?: number;
}
```

### Mock up your _Firebase class

Lay down the basic foundations for your _Firebase class. Here, we have a public
variable with all the public information we want to use called `user`. We also
have an `auth_user` variable to interface with the Firebase API.

```ts
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
}
```

Then add the necessary functions to get your started with authenticating
and signing out of Firebase.

```ts
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
        // The following actions are dependent on your usage.
        // For us, we make a POST request to create the user if it didn't exist
        // And a GET request when it does
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
```

### Integrating your _Firebase class into React

Now we need to integrate the `_Firebase` object into our React application. We can do
that easily with the `createContext` hook.

In your `App.tsx` file you can create a Context that can be shared amongst all child
components.

```ts
export const FirebaseClassContext = createContext({
  firebase: new _Firebase(),
  updateFirebase: (_u: UserInfo) => {
    return new Promise((_x) => {
      _x;
    });
  },
});
```

From there you can simply add a wrapping component around your React application
that uses this Context.

```tsx
export default function App(): JSX.Element {
  const [isSignedIn, setIsSignedIn] = useState<boolean | undefined>(undefined);
  const [firebase, setFirebase] = useState(new _Firebase());
  function updateFirebase(userInfo: UserInfo) {
    return firebase.updateUser(userInfo).then(() => {
      // Copy firebase object so React will detect state change
      setFirebase(
        Object.assign(Object.create(Object.getPrototypeOf(firebase)), firebase),
      );
    });
  }
  useEffect(() => {
    firebase.load(
      () => {
        setIsSignedIn(true);
      },
      () => {
        setIsSignedIn(false);
      },
    );
  }, []);

    if (isSignedIn === undefined) {
    return (
      <div className="center">
        <h1>Loading...</h1>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div id="authWrapper">
        <div className="text" id="signIn">
          {' '}
          Sign In{' '}
        </div>
        <StyledFirebaseAuth
          uiConfig={firebase.uiConfig()}
          firebaseAuth={firebase.auth()}
        />
      </div>
    );
  }

  return (
    <FirebaseClassContext.Provider
      value={{ firebase: firebase, updateFirebase }}
    >
      <YourApp />
    </FirebaseClassContext.Provider>
  );
}
```

### Customizing your Firebase Class

From here you can customize your _Firebase Class to whatever your application needs.
In `Password` we used our _Firebase class to perform CRUD operations on the Firestore
database.

If as an example, you can look at our [`firebase.ts`](examples/firebase.ts) file for more details.