# 🚀 Firebase Setup Guide - Connect Your Site in 30 Minutes

## Step 1: Create Firebase Account (5 minutes)

### A) Go to Firebase
1. Open: https://firebase.google.com
2. Click **"Get Started"**
3. Sign in with your Google account
4. Click **"Create a project"**

### B) Project Setup
1. **Project name:** `one-up-travel`
2. Click **Continue**
3. **Google Analytics:** Turn OFF (you can add later)
4. Click **Create project**
5. Wait 30 seconds...
6. Click **Continue**

✅ **You now have a Firebase project!**

---

## Step 2: Add Web App (3 minutes)

### A) Add Firebase to your web app
1. In Firebase console, click the **</>** icon (Web)
2. **App nickname:** `One-Up Travel Web`
3. ✅ Check **"Also set up Firebase Hosting"**
4. Click **Register app**

### B) Copy Your Config
You'll see code like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "one-up-travel.firebaseapp.com",
  projectId: "one-up-travel",
  storageBucket: "one-up-travel.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

📋 **COPY THIS!** You'll need it in Step 4.

5. Click **Continue to console**

✅ **Firebase is now connected to your project!**

---

## Step 3: Enable Authentication (2 minutes)

### A) Enable Email/Password Auth
1. In Firebase console, click **Authentication** (left sidebar)
2. Click **Get started**
3. Click **Email/Password**
4. Toggle **Enable** to ON
5. Click **Save**

### B) Enable Google Sign-In
1. Click **Google** (in the same list)
2. Toggle **Enable** to ON
3. **Project support email:** Select your email
4. Click **Save**

✅ **Users can now sign in with Email or Google!**

---

## Step 4: Enable Firestore Database (2 minutes)

### A) Create Database
1. In Firebase console, click **Firestore Database** (left sidebar)
2. Click **Create database**
3. **Start mode:** Select **"Production mode"** (we'll add security later)
4. **Location:** Choose closest to you (e.g., `us-central` for USA, `australia-southeast1` for Australia)
5. Click **Enable**
6. Wait 30 seconds...

✅ **Database is ready!**

---

## Step 5: Add Firebase to Your Website (10 minutes)

Now let's connect your HTML files to Firebase!

### A) Create Firebase Config File

Create a new file called `firebase-config.js`:

```javascript
// firebase-config.js

// Import Firebase modules
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where, orderBy } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// 🔥 PASTE YOUR CONFIG HERE (from Step 2)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Export so other files can use them
export { auth, db, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where, orderBy };
```

**Important:** Replace `YOUR_API_KEY`, `YOUR_PROJECT`, etc. with your actual values from Step 2!

---

### B) Update auth.html

Add this to the `<head>` section of `auth.html`:

```html
<!-- Add before closing </head> tag -->
<script type="module" src="firebase-config.js"></script>
<script type="module" src="auth-handler.js"></script>
```

Now create `auth-handler.js`:

```javascript
// auth-handler.js

import { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from './firebase-config.js';

// Sign Up with Email/Password
window.handleSignUp = async function(event) {
  event.preventDefault();
  
  const name = event.target[0].value;
  const email = event.target[1].value;
  const password = event.target[2].value;
  
  try {
    // Create user account
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    console.log('Account created!', user);
    alert('Account created successfully! 🎉');
    
    // Redirect to dashboard
    window.location.href = 'dashboard.html';
    
  } catch (error) {
    console.error('Signup error:', error);
    alert('Error: ' + error.message);
  }
}

// Sign In with Email/Password
window.handleSignIn = async function(event) {
  event.preventDefault();
  
  const email = event.target[0].value;
  const password = event.target[1].value;
  
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    console.log('Signed in!', user);
    alert('Welcome back! 👋');
    
    // Redirect to dashboard
    window.location.href = 'dashboard.html';
    
  } catch (error) {
    console.error('Signin error:', error);
    alert('Error: ' + error.message);
  }
}

// Google Sign-In
window.socialLogin = async function(provider) {
  if (provider !== 'google') {
    alert('Only Google sign-in is configured. Apple coming soon!');
    return;
  }
  
  const googleProvider = new GoogleAuthProvider();
  
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    console.log('Google sign-in successful!', user);
    alert('Welcome! 🎉');
    
    // Redirect to dashboard
    window.location.href = 'dashboard.html';
    
  } catch (error) {
    console.error('Google signin error:', error);
    alert('Error: ' + error.message);
  }
}
```

✅ **Auth is now working!** Users can sign up and log in!

---

### C) Add "Save Trip" to itinerary-layla.html

Add this button after your "Book This Trip" button:

```html
<!-- Add in the total section -->
<button class="save-trip-btn" onclick="saveCurrentTrip()">
  💾 Save This Trip
</button>

<style>
.save-trip-btn {
  width: 100%;
  padding: 18px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 14px;
  color: white;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 15px;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
}

.save-trip-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 40px rgba(102, 126, 234, 0.6);
}
</style>
```

Then add this script at the bottom of `itinerary-layla.html` before `</body>`:

```html
<script type="module">
import { auth, db, collection, addDoc } from './firebase-config.js';
import { onAuthStateChanged } from './firebase-config.js';

// Check if user is logged in
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log('User is logged in:', user.email);
    document.querySelector('.save-trip-btn').style.display = 'block';
  } else {
    console.log('User not logged in');
    document.querySelector('.save-trip-btn').style.display = 'none';
  }
});

// Save trip to database
window.saveCurrentTrip = async function() {
  const user = auth.currentUser;
  
  if (!user) {
    alert('Please sign in to save trips!');
    window.location.href = 'auth.html';
    return;
  }
  
  try {
    // Add trip to Firestore
    const docRef = await addDoc(collection(db, 'trips'), {
      userId: user.uid,
      userEmail: user.email,
      destination: tripData.destination,
      startDate: tripData.startDate,
      endDate: tripData.endDate,
      duration: tripData.duration,
      flights: tripData.flights,
      accommodation: tripData.accommodation,
      activities: tripData.activities,
      insurance: tripData.insurance,
      weather: tripData.weather,
      totalCost: tripData.flights.reduce((sum, f) => sum + f.price, 0) +
                 tripData.accommodation.reduce((sum, a) => sum + a.price, 0) +
                 tripData.activities.reduce((sum, a) => sum + a.price, 0) +
                 tripData.insurance.reduce((sum, i) => sum + i.price, 0),
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    console.log('Trip saved with ID:', docRef.id);
    alert('Trip saved! 🎉\n\nView your saved trips in the dashboard.');
    
  } catch (error) {
    console.error('Error saving trip:', error);
    alert('Error saving trip. Please try again.');
  }
}
</script>
```

✅ **Users can now save trips!**

---

## Step 6: Test Everything (5 minutes)

### A) Test Authentication
1. Open `auth.html` in your browser
2. Click **"Create Account"**
3. Enter email + password
4. Click **"Create Account"**
5. Check console (F12) for success message

### B) Test Trip Saving
1. Open `itinerary-layla.html`
2. Click **"Save This Trip"**
3. Go to Firebase Console → Firestore Database
4. You should see your trip data!

---

## 🎯 **Your File Structure Should Look Like:**

```
your-project/
├── index-layla.html
├── itinerary-layla.html
├── auth.html
├── logo.png
├── firebase-config.js        ← NEW!
└── auth-handler.js           ← NEW!
```

---

## 🔐 **Security Rules (Important!)**

Right now, ANYONE can read/write your database. Let's fix that!

### Go to Firestore → Rules and paste this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users can only read/write their own trips
    match /trips/{tripId} {
      allow read: if request.auth != null && 
                    (resource.data.userId == request.auth.uid || 
                     resource.data.isPublic == true);
      allow create: if request.auth != null && 
                      request.resource.data.userId == request.auth.uid;
      allow update, delete: if request.auth != null && 
                               resource.data.userId == request.auth.uid;
    }
    
    // User profiles
    match /users/{userId} {
      allow read, write: if request.auth != null && 
                           request.auth.uid == userId;
    }
  }
}
```

Click **Publish** ✅

**What this does:**
- ✅ Users can only see THEIR OWN trips
- ✅ Public trips (isPublic: true) are visible to everyone
- ✅ Users can't delete other people's trips
- ✅ Must be logged in to access database

---

## 🚀 **What You Can Do Now:**

✅ Users can sign up with email/password  
✅ Users can sign in with Google  
✅ Users can save trips to database  
✅ Each user's trips are private  
✅ Data is secure  

---

## 🎉 **Next Steps:**

### Week 1 (This Week):
1. ✅ Get Firebase working (you just did this!)
2. Add logout button
3. Create "My Trips" page to view saved trips

### Week 2:
1. Add trip editing
2. Add trip deletion
3. Add trip sharing

### Week 3:
1. Add PDF export
2. Add calendar export
3. Add social sharing

---

## 🆘 **Troubleshooting:**

### Problem: "Firebase not defined"
**Solution:** Make sure you added `type="module"` to script tags:
```html
<script type="module" src="firebase-config.js"></script>
```

### Problem: "Auth domain not authorized"
**Solution:** 
1. Go to Firebase Console → Authentication → Settings
2. Add your domain to "Authorized domains"
3. For local testing, add: `localhost`

### Problem: "Permission denied"
**Solution:** 
1. Check you're logged in (`auth.currentUser` exists)
2. Check security rules are published
3. Check userId matches in database

### Problem: "Module not found"
**Solution:** Files must be served via HTTP (not file://):
- Use VS Code Live Server extension, OR
- Run: `python3 -m http.server 8000`
- Then open: `http://localhost:8000`

---

## 💡 **Quick Test:**

Open browser console (F12) and type:
```javascript
import('./firebase-config.js').then(m => console.log('Firebase loaded!', m.auth));
```

If you see "Firebase loaded!" → Everything is working! 🎉

---

## 📞 **Need Help?**

Firebase docs: https://firebase.google.com/docs/web/setup  
Authentication: https://firebase.google.com/docs/auth/web/start  
Firestore: https://firebase.google.com/docs/firestore/quickstart  

---

**You're all set!** 🚀 Now run through the test steps and let me know if you get stuck on anything!
