# 🔐 Account & Social Features Implementation Guide

## Overview
This guide covers implementing user accounts, trip saving, PDF export, sharing, and social features for One-Up Travel.

---

## 🎯 **Features to Build**

### **Core Account Features:**
1. ✅ Sign up / Login
2. ✅ User profile (name, photo, preferences)
3. ✅ Save trips (unlimited)
4. ✅ View trip history
5. ✅ Edit saved trips
6. ✅ Delete trips

### **Social Features:**
7. ✅ Share trip via link
8. ✅ Collaborate on trips with friends
9. ✅ Merge/combine trips
10. ✅ Trip comments & chat
11. ✅ Follow friends
12. ✅ See friends' public trips

### **Export Features:**
13. ✅ Download as PDF
14. ✅ Export to calendar (.ics)
15. ✅ Print-friendly version
16. ✅ Share to social media (Instagram, Facebook)

---

## 🏗️ **Technical Stack Recommendations**

### **Option 1: Firebase (Easiest - Recommended for MVP)**
**Why:** Free tier, no backend coding needed, real-time updates

```
Authentication: Firebase Auth (Google, Email, Apple)
Database: Firestore (NoSQL)
Storage: Firebase Storage (for profile pics, trip images)
Hosting: Firebase Hosting
Functions: Firebase Cloud Functions (for PDFs, emails)
```

**Cost:** FREE for up to:
- 50K reads/day
- 20K writes/day
- 10GB storage
- 10GB bandwidth

Perfect for MVP! Upgrade later if needed.

### **Option 2: Supabase (Modern alternative)**
**Why:** Open source, PostgreSQL, similar to Firebase

```
Authentication: Supabase Auth
Database: PostgreSQL
Storage: Supabase Storage
Functions: Edge Functions
```

**Cost:** FREE for up to:
- 500MB database
- 1GB storage
- 2GB bandwidth

### **Option 3: Full Stack (For when you hire developers)**
```
Frontend: React/Next.js
Backend: Node.js + Express
Database: PostgreSQL + Prisma
Auth: NextAuth.js
Hosting: Vercel
```

---

## 📋 **Implementation Roadmap**

### **PHASE 1: Authentication (Week 1)**

**Step 1:** Set up Firebase
```javascript
// firebase-config.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "oneup-travel.firebaseapp.com",
  projectId: "oneup-travel",
  storageBucket: "oneup-travel.appspot.com",
  messagingSenderId: "YOUR_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

**Step 2:** Add Login/Signup UI
- Google Sign-In button
- Email/Password form
- "Continue as Guest" option

**Step 3:** Protect Routes
- Redirect to login if not authenticated
- Show user profile in header

---

### **PHASE 2: Save Trips (Week 2)**

**Database Structure:**
```javascript
// Firestore Collections

users/
  {userId}/
    profile: {
      name: "John Doe",
      email: "john@example.com",
      photoURL: "https://...",
      createdAt: timestamp,
      preferences: {
        currency: "USD",
        travelStyle: "adventure"
      }
    }

trips/
  {tripId}/
    userId: "user123",
    destination: "Bali, Indonesia",
    startDate: "2026-03-15",
    endDate: "2026-03-22",
    duration: 7,
    flights: [...],
    accommodation: [...],
    activities: [...],
    insurance: [...],
    weather: [...],
    localEvents: [...],
    totalCost: 2450,
    status: "planning", // planning, booked, completed
    isPublic: false,
    createdAt: timestamp,
    updatedAt: timestamp,
    collaborators: ["user456", "user789"], // For shared trips
    bookingProgress: {
      flights: false,
      hotel: false,
      activities: false,
      insurance: false
    }
```

**Save Trip Function:**
```javascript
import { collection, addDoc } from 'firebase/firestore';

async function saveTrip(tripData) {
  try {
    const tripRef = await addDoc(collection(db, 'trips'), {
      ...tripData,
      userId: auth.currentUser.uid,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    alert('Trip saved! ✅');
    return tripRef.id;
  } catch (error) {
    console.error('Error saving trip:', error);
    alert('Failed to save trip');
  }
}
```

---

### **PHASE 3: Trip History Dashboard (Week 3)**

**New Page:** `my-trips.html`

Features:
- Grid of saved trips
- Filter by: Upcoming, Past, All
- Sort by: Date, Destination, Cost
- Search bar
- Quick actions: Edit, Delete, Share, Duplicate

**UI:**
```
┌─────────────────────────────────────────┐
│  My Trips                    + New Trip │
├─────────────────────────────────────────┤
│  [Upcoming] [Past] [All]      🔍 Search │
├─────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐             │
│  │ Bali     │  │ Tokyo    │             │
│  │ Mar 2026 │  │ Jun 2026 │             │
│  │ $2,450   │  │ $3,200   │             │
│  │ ⚡ Planning│ │ ✅ Booked │             │
│  └──────────┘  └──────────┘             │
└─────────────────────────────────────────┘
```

---

### **PHASE 4: Share Trip (Week 4)**

**Share Options:**

1. **Shareable Link** (Public)
   ```javascript
   async function generateShareLink(tripId) {
     // Make trip public
     await updateDoc(doc(db, 'trips', tripId), {
       isPublic: true
     });
     
     const shareUrl = `https://oneuptravel.com/trip/${tripId}`;
     
     // Copy to clipboard
     navigator.clipboard.writeText(shareUrl);
     alert('Link copied! Anyone with this link can view your trip.');
   }
   ```

2. **Invite Collaborators** (Private)
   ```javascript
   async function inviteCollaborator(tripId, email) {
     // Find user by email
     const userQuery = query(
       collection(db, 'users'),
       where('email', '==', email)
     );
     const userSnapshot = await getDocs(userQuery);
     
     if (userSnapshot.empty) {
       alert('User not found. Invite them to join One-Up Travel!');
       return;
     }
     
     const collaboratorId = userSnapshot.docs[0].id;
     
     // Add to collaborators array
     await updateDoc(doc(db, 'trips', tripId), {
       collaborators: arrayUnion(collaboratorId)
     });
     
     // Send notification
     alert(`Invited ${email} to collaborate!`);
   }
   ```

3. **Social Media Share**
   ```javascript
   function shareToSocial(platform, tripData) {
     const text = `Check out my ${tripData.duration}-day trip to ${tripData.destination}!`;
     const url = `https://oneuptravel.com/trip/${tripData.id}`;
     
     const shareUrls = {
       facebook: `https://facebook.com/sharer/sharer.php?u=${url}`,
       twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
       instagram: 'copy-link', // Instagram doesn't support direct sharing
       whatsapp: `https://wa.me/?text=${text} ${url}`
     };
     
     window.open(shareUrls[platform], '_blank');
   }
   ```

---

### **PHASE 5: Collaboration Features (Week 5)**

**Real-time Collaboration:**
```javascript
// Listen for trip updates
import { onSnapshot } from 'firebase/firestore';

function subscribeToTrip(tripId, callback) {
  const tripRef = doc(db, 'trips', tripId);
  
  return onSnapshot(tripRef, (snapshot) => {
    const tripData = snapshot.data();
    callback(tripData);
  });
}

// Usage:
const unsubscribe = subscribeToTrip('trip123', (updatedTrip) => {
  // Re-render UI with new data
  renderItinerary(updatedTrip);
  showNotification('Trip updated by collaborator');
});
```

**Trip Chat:**
```javascript
// trips/{tripId}/messages subcollection
{
  messageId: {
    userId: "user123",
    userName: "John",
    userPhoto: "https://...",
    text: "What time should we meet at the airport?",
    timestamp: timestamp,
    type: "comment" // or "system" for auto-messages
  }
}
```

**Merge Trips:**
```javascript
async function mergeTrips(tripId1, tripId2) {
  const trip1 = await getDoc(doc(db, 'trips', tripId1));
  const trip2 = await getDoc(doc(db, 'trips', tripId2));
  
  const mergedTrip = {
    destination: `${trip1.destination} & ${trip2.destination}`,
    startDate: earlierDate(trip1.startDate, trip2.startDate),
    endDate: laterDate(trip1.endDate, trip2.endDate),
    flights: [...trip1.flights, ...trip2.flights],
    accommodation: [...trip1.accommodation, ...trip2.accommodation],
    activities: [...trip1.activities, ...trip2.activities],
    // ... merge all data
  };
  
  // Create new merged trip
  const mergedRef = await addDoc(collection(db, 'trips'), mergedTrip);
  
  alert('Trips merged! 🎉');
  return mergedRef.id;
}
```

---

### **PHASE 6: PDF Export (Week 6)**

**Option 1: Client-Side (jsPDF)**
```javascript
import jsPDF from 'jspdf';

function exportToPDF(tripData) {
  const doc = new jsPDF();
  
  // Add logo
  doc.addImage(logoBase64, 'PNG', 10, 10, 40, 15);
  
  // Title
  doc.setFontSize(24);
  doc.text(`Trip to ${tripData.destination}`, 10, 40);
  
  // Dates
  doc.setFontSize(12);
  doc.text(`${tripData.startDate} - ${tripData.endDate}`, 10, 50);
  
  // Flights
  doc.setFontSize(16);
  doc.text('Flights', 10, 70);
  tripData.flights.forEach((flight, i) => {
    doc.setFontSize(10);
    doc.text(`${flight.title}: $${flight.price}`, 10, 80 + (i * 10));
  });
  
  // ... add all sections
  
  // Save
  doc.save(`${tripData.destination}-itinerary.pdf`);
}
```

**Option 2: Server-Side (Better Quality)**
```javascript
// Firebase Cloud Function
const functions = require('firebase-functions');
const PDFDocument = require('pdfkit');

exports.generatePDF = functions.https.onCall(async (data, context) => {
  const tripData = data.tripData;
  
  const doc = new PDFDocument();
  const chunks = [];
  
  doc.on('data', chunk => chunks.push(chunk));
  doc.on('end', () => {
    const pdfBuffer = Buffer.concat(chunks);
    // Upload to Firebase Storage
    // Return download URL
  });
  
  // Generate PDF with better styling
  doc.fontSize(24).text(`Trip to ${tripData.destination}`);
  // ... add content
  
  doc.end();
});
```

---

### **PHASE 7: Calendar Export (Week 7)**

**Generate .ics File:**
```javascript
function exportToCalendar(tripData) {
  let ics = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//One-Up Travel//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH

`;

  // Add flights
  tripData.flights.forEach(flight => {
    ics += `BEGIN:VEVENT
UID:${flight.id}@oneuptravel.com
DTSTAMP:${formatICSDate(new Date())}
DTSTART:${formatICSDate(flight.departureTime)}
DTEND:${formatICSDate(flight.arrivalTime)}
SUMMARY:${flight.title}
DESCRIPTION:${flight.details}
LOCATION:${flight.departure} to ${flight.arrival}
STATUS:CONFIRMED
END:VEVENT

`;
  });

  // Add activities
  tripData.activities.forEach(activity => {
    ics += `BEGIN:VEVENT
UID:${activity.id}@oneuptravel.com
DTSTAMP:${formatICSDate(new Date())}
DTSTART:${formatICSDate(activity.date)}
SUMMARY:${activity.title}
DESCRIPTION:${activity.details}
STATUS:CONFIRMED
END:VEVENT

`;
  });

  ics += `END:VCALENDAR`;

  // Download
  const blob = new Blob([ics], { type: 'text/calendar' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${tripData.destination}-calendar.ics`;
  a.click();
}

function formatICSDate(date) {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}
```

---

## 🎨 **UI Components to Build**

### **1. Account Menu**
```html
<!-- Top right corner -->
<div class="account-menu">
  <img src="user.photoURL" class="avatar" onclick="toggleMenu()">
  <div class="dropdown">
    <a href="profile.html">My Profile</a>
    <a href="my-trips.html">My Trips</a>
    <a href="settings.html">Settings</a>
    <a onclick="logout()">Logout</a>
  </div>
</div>
```

### **2. Save Trip Button**
```html
<button class="save-btn" onclick="saveTrip()">
  💾 Save Trip
</button>
```

### **3. Share Modal**
```html
<div class="share-modal">
  <h3>Share Your Trip</h3>
  
  <div class="share-option">
    <button onclick="generateShareLink()">📋 Copy Link</button>
    <small>Anyone with the link can view</small>
  </div>
  
  <div class="share-option">
    <input type="email" placeholder="Enter friend's email">
    <button onclick="inviteCollaborator()">✉️ Invite</button>
  </div>
  
  <div class="share-socials">
    <button onclick="shareToSocial('facebook')">Facebook</button>
    <button onclick="shareToSocial('twitter')">Twitter</button>
    <button onclick="shareToSocial('whatsapp')">WhatsApp</button>
  </div>
</div>
```

### **4. Export Menu**
```html
<div class="export-menu">
  <button onclick="exportToPDF()">📄 Download PDF</button>
  <button onclick="exportToCalendar()">📅 Add to Calendar</button>
  <button onclick="window.print()">🖨️ Print</button>
</div>
```

---

## 💰 **Monetization Ideas**

Once you have accounts and social features:

1. **Free Tier:**
   - Save up to 3 trips
   - Basic sharing
   - Standard PDF export

2. **Pro Tier ($9.99/month):**
   - Unlimited trips
   - Collaboration features
   - Premium PDF templates
   - Priority support
   - Price drop alerts

3. **Team Tier ($29.99/month):**
   - Group trip planning
   - Shared budgets
   - Admin controls
   - Custom branding

---

## 📊 **Analytics to Track**

```javascript
import { logEvent } from 'firebase/analytics';

// Track important events
logEvent(analytics, 'trip_saved', { destination: 'Bali' });
logEvent(analytics, 'trip_shared', { method: 'link' });
logEvent(analytics, 'pdf_downloaded', { tripId: '123' });
logEvent(analytics, 'trip_booked', { totalCost: 2450 });
```

---

## 🚀 **Implementation Timeline**

| Week | Feature | Priority |
|------|---------|----------|
| 1 | Firebase setup + Auth | 🔴 Critical |
| 2 | Save/Load trips | 🔴 Critical |
| 3 | Trip history page | 🟡 High |
| 4 | Share links | 🟡 High |
| 5 | Collaboration | 🟢 Medium |
| 6 | PDF export | 🟡 High |
| 7 | Calendar export | 🟢 Medium |
| 8 | Social features | 🟢 Medium |

---

## 🎯 **Next Steps**

1. **This Week:**
   - Sign up for Firebase (free)
   - Set up project
   - Add Google Sign-In button to your site
   - Test login/logout

2. **Next Week:**
   - Implement "Save Trip" button
   - Create trips collection in Firestore
   - Build "My Trips" page

3. **Following Weeks:**
   - Add sharing features
   - Build PDF export
   - Add collaboration

---

## 📚 **Resources**

- Firebase Docs: https://firebase.google.com/docs
- jsPDF Library: https://github.com/parallax/jsPDF
- ICS Calendar Spec: https://icalendar.org/
- React Firebase Hooks: https://github.com/CSFrequency/react-firebase-hooks

---

Want me to build the actual UI components and Firebase integration code for you right now? I can create:

1. Login/Signup page
2. Save Trip functionality
3. My Trips dashboard
4. Share modal
5. PDF export button

Just let me know which one to start with! 🚀
