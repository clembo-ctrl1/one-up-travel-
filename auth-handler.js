// auth-handler.js
// Handles all authentication (sign up, sign in, Google login)

import { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut } from './firebase-config.js';

// ========================================
// SIGN UP WITH EMAIL/PASSWORD
// ========================================
window.handleSignUp = async function(event) {
  event.preventDefault();
  
  const name = event.target[0].value;
  const email = event.target[1].value;
  const password = event.target[2].value;
  
  // Validate
  if (password.length < 8) {
    alert('Password must be at least 8 characters');
    return;
  }
  
  try {
    // Create Firebase account
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    console.log('✅ Account created:', user.email);
    
    // Save name to localStorage (in production, save to Firestore)
    localStorage.setItem('userName', name);
    
    // Show success
    alert(`Welcome to One-Up Travel, ${name}! 🎉\n\nYour account has been created.`);
    
    // Redirect to home page
    window.location.href = 'index-layla.html';
    
  } catch (error) {
    console.error('❌ Sign up error:', error);
    
    // User-friendly error messages
    if (error.code === 'auth/email-already-in-use') {
      alert('This email is already registered. Try signing in instead!');
    } else if (error.code === 'auth/invalid-email') {
      alert('Please enter a valid email address');
    } else if (error.code === 'auth/weak-password') {
      alert('Password is too weak. Please use at least 8 characters.');
    } else {
      alert('Error creating account: ' + error.message);
    }
  }
}

// ========================================
// SIGN IN WITH EMAIL/PASSWORD
// ========================================
window.handleSignIn = async function(event) {
  event.preventDefault();
  
  const email = event.target[0].value;
  const password = event.target[1].value;
  
  try {
    // Sign in to Firebase
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    console.log('✅ Signed in:', user.email);
    
    // Show success
    alert(`Welcome back! 👋`);
    
    // Redirect to home page
    window.location.href = 'index-layla.html';
    
  } catch (error) {
    console.error('❌ Sign in error:', error);
    
    // User-friendly error messages
    if (error.code === 'auth/user-not-found') {
      alert('No account found with this email. Please sign up first!');
    } else if (error.code === 'auth/wrong-password') {
      alert('Incorrect password. Please try again.');
    } else if (error.code === 'auth/invalid-email') {
      alert('Please enter a valid email address');
    } else {
      alert('Error signing in: ' + error.message);
    }
  }
}

// ========================================
// GOOGLE SIGN-IN
// ========================================
window.socialLogin = async function(provider) {
  if (provider === 'apple') {
    alert('Apple Sign-In coming soon! 🍎\n\nFor now, please use Google or Email.');
    return;
  }
  
  if (provider !== 'google') {
    return;
  }
  
  const googleProvider = new GoogleAuthProvider();
  
  try {
    // Open Google popup
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    console.log('✅ Google sign-in successful:', user.email);
    
    // Show success
    alert(`Welcome, ${user.displayName}! 🎉`);
    
    // Redirect to home page
    window.location.href = 'index-layla.html';
    
  } catch (error) {
    console.error('❌ Google sign-in error:', error);
    
    // User-friendly error messages
    if (error.code === 'auth/popup-closed-by-user') {
      // User closed popup - do nothing
    } else if (error.code === 'auth/popup-blocked') {
      alert('Pop-up was blocked! Please allow pop-ups for this site.');
    } else {
      alert('Error with Google sign-in: ' + error.message);
    }
  }
}

// ========================================
// TOGGLE BETWEEN SIGN IN / SIGN UP FORMS
// ========================================
window.toggleForm = function(form) {
  const signinForm = document.getElementById('signinForm');
  const signupForm = document.getElementById('signupForm');
  
  if (form === 'signup') {
    signinForm.classList.add('hidden');
    signupForm.classList.remove('hidden');
  } else {
    signupForm.classList.add('hidden');
    signinForm.classList.remove('hidden');
  }
}

// ========================================
// LOGOUT
// ========================================
window.logout = async function() {
  try {
    await signOut(auth);
    console.log('✅ Signed out');
    alert('You have been signed out. See you next time! 👋');
    window.location.href = 'index-layla.html';
  } catch (error) {
    console.error('❌ Logout error:', error);
    alert('Error signing out');
  }
}

console.log('✅ Auth handler loaded');
