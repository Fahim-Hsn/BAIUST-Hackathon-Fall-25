# MonBondhu - Mental and Physical Health Support Platform

MonBondhu is a web-based platform designed to provide mental and physical health support, specifically for rural Bangladesh. The platform allows users to track their mood, submit anonymous help requests, and find local clinics. It is built with a **Bangla** language interface for easy accessibility.

---

## **Features**

### **For Users**
- **Mood Tracker**: Track and save daily moods (happy, sad, etc.) with optional notes.
- **Help Requests**: Submit anonymous help requests for mental or physical health support.
- **History**: View past moods and help requests.

### **For Admin**
- **Help Requests Management**: View and respond to all user help requests.
- **Analytics Dashboard**: View mood trends and track platform usage.
- **User Data**: View user data and mood statistics.

---

## **API Endpoints**

### **1. User Registration/Login**
- **Register User**:  
  **POST** `http://localhost:5005/api/users/register`  
  Used to register a new user in the system.

- **Login User**:  
  **POST** `http://localhost:5005/api/users/login`  
  Used to authenticate and log in a user.

- **Recover User**:  
  **POST** `http://localhost:5005/api/users/recover`  
  Used for password recovery or account recovery.

### **2. Mood & Help Endpoints**
- **Submit Mood**:  
  **POST** `http://localhost:5005/api/mood`  
  Used to submit mood data for the user.

- **Get User Mood History**:  
  **GET** `http://localhost:5005/api/mood/:userId`  
  Retrieve all mood data for a specific user based on their `userId`.

- **Submit Help Request**:  
  **POST** `http://localhost:5005/api/help`  
  Used to submit a help request (mental health, medical support, etc.).

- **Get Help Requests**:  
  **GET** `http://localhost:5005/api/help`  
  Retrieve all help requests submitted by the user or available in the system.

### **3. Server Status**
- **Check Server Status**:  
  **GET** `http://localhost:5005/api/status`  
  Used to check if the backend server is running and available.

---

## **System Design**
For detailed system architecture and design, check out the [MonBondhu System Design](link-to-system-design-file).

---

## **Tech Stack**
- **Frontend**: React, Tailwind CSS, Axios, React Router
- **Backend**: Node.js, Express.js, Mongoose (MongoDB)
- **Database**: MongoDB (MongoDB Atlas)
- **Hosting**: Vercel (Frontend), Render/Railway (Backend)

---

## **How to Run Locally**

### **Frontend Setup**
1. Clone the repository.
2. Navigate to the `frontend` folder.
3. Run `npm install` to install all dependencies.
4. Run `npm run dev` to start the development server at **http://localhost:5173**.

### **Backend Setup**
1. Navigate to the `backend` folder.
2. Install dependencies: `npm install`.
3. Set up environment variables (like MongoDB URI, JWT secret, etc.).
4. Run the backend server: `npm run dev` on **http://localhost:5005**.

---

## **Deployment**

- **Frontend**: Deploy the frontend on **Vercel** for easy scaling.
- **Backend**: Deploy the backend on **Render** or **Railway**.
- **Database**: Use **MongoDB Atlas** for a scalable cloud database.

---

## **Testing**

### **Backend Testing**
- Test API routes using **Postman** or **Thunder Client**:
  - **POST** `/api/mood`
  - **GET** `/api/mood/:userId`
  - **POST** `/api/help`
  - **GET** `/api/help`

### **Frontend Testing**
- Manually test form submissions and data flow between frontend and backend.
- Test responsiveness for mobile and desktop views.

---

## **Future Features**
1. **Voice Input**: Allow users to track moods and submit help requests using voice.
2. **Event Page**: Display upcoming health events users can attend.
3. **Admin Features**: Enhance the admin dashboard to include detailed user engagement analytics.
4. **Authentication (JWT)**: Add secure authentication for users and admins.

---

## **License**
MIT License. See `LICENSE` for more details.
