// trip-saver.js
// Saves trips to Firebase when user clicks "Save Trip"

import { auth, db, collection, addDoc, onAuthStateChanged } from './firebase-config.js';

// ========================================
// CHECK IF USER IS LOGGED IN
// ========================================
onAuthStateChanged(auth, (user) => {
  const saveBtn = document.querySelector('.save-trip-btn');
  
  if (user) {
    console.log('✅ User logged in:', user.email);
    if (saveBtn) {
      saveBtn.style.display = 'block';
      saveBtn.innerHTML = '💾 Save This Trip';
    }
  } else {
    console.log('❌ User not logged in');
    if (saveBtn) {
      saveBtn.style.display = 'block';
      saveBtn.innerHTML = '🔒 Sign In to Save';
      saveBtn.onclick = () => {
        window.location.href = 'auth.html';
      };
    }
  }
});

// ========================================
// SAVE TRIP TO FIREBASE
// ========================================
window.saveCurrentTrip = async function() {
  const user = auth.currentUser;
  
  // Check if logged in
  if (!user) {
    const shouldSignIn = confirm('Sign in to save your trip and access it anytime!\n\nWould you like to sign in now?');
    if (shouldSignIn) {
      window.location.href = 'auth.html';
    }
    return;
  }
  
  // Show loading state
  const saveBtn = document.querySelector('.save-trip-btn');
  const originalText = saveBtn.innerHTML;
  saveBtn.innerHTML = '⏳ Saving...';
  saveBtn.disabled = true;
  
  try {
    // Calculate total cost
    const totalCost = 
      (tripData.flights?.reduce((sum, f) => sum + f.price, 0) || 0) +
      (tripData.accommodation?.reduce((sum, a) => sum + a.price, 0) || 0) +
      (tripData.activities?.reduce((sum, a) => sum + a.price, 0) || 0) +
      (tripData.insurance?.reduce((sum, i) => sum + i.price, 0) || 0);
    
    // Save to Firestore
    const docRef = await addDoc(collection(db, 'trips'), {
      // User info
      userId: user.uid,
      userEmail: user.email,
      userName: user.displayName || localStorage.getItem('userName') || 'Anonymous',
      
      // Trip basics
      destination: tripData.destination,
      startDate: tripData.startDate,
      endDate: tripData.endDate,
      duration: tripData.duration,
      totalCost: totalCost,
      
      // Trip details
      flights: tripData.flights || [],
      accommodation: tripData.accommodation || [],
      activities: tripData.activities || [],
      insurance: tripData.insurance || [],
      weather: tripData.weather || [],
      localEvents: tripData.localEvents || [],
      nearbyAttractions: tripData.nearbyAttractions || [],
      coordinates: tripData.coordinates || null,
      
      // Metadata
      status: 'planning', // planning, booked, completed
      isPublic: false,
      bookingProgress: {
        flights: false,
        hotel: false,
        activities: false,
        insurance: false,
        total: false
      },
      
      // Timestamps
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    console.log('✅ Trip saved! ID:', docRef.id);
    
    // Success feedback
    saveBtn.innerHTML = '✅ Saved!';
    saveBtn.style.background = 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)';
    
    // Show success message
    setTimeout(() => {
      alert('Trip saved successfully! 🎉\n\nView all your trips in the dashboard.');
      
      // Reset button after 2 seconds
      setTimeout(() => {
        saveBtn.innerHTML = originalText;
        saveBtn.style.background = '';
        saveBtn.disabled = false;
      }, 2000);
    }, 500);
    
  } catch (error) {
    console.error('❌ Error saving trip:', error);
    
    // Error feedback
    saveBtn.innerHTML = '❌ Error';
    saveBtn.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
    
    alert('Failed to save trip. Please try again.\n\nError: ' + error.message);
    
    // Reset button
    setTimeout(() => {
      saveBtn.innerHTML = originalText;
      saveBtn.style.background = '';
      saveBtn.disabled = false;
    }, 2000);
  }
}

console.log('✅ Trip saver loaded');
