# MonBondhu

মনবন্ধু: গ্রামের মানুষের জন্য স্বাস্থ্য সহায়তা প্ল্যাটফর্ম (Bangla-first UI)

## রান লোকালি

### 1) ব্যাকএন্ড

- ফোল্ডার: `backend`
- `.env` তৈরি করুন (উদাহরণ):

```
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/monbondhu?retryWrites=true&w=majority
MONGO_DB=monbondhu
SKIP_DB=false
```

- ইনস্টল ও রান:

```
cd backend
npm install
npm run dev
```

> ডাটাবেস ছাড়া চালাতে চাইলে `.env` এ `SKIP_DB=true` দিন। এতে ইন-মেমরি স্টোর ব্যবহার হবে এবং MongoDB লাগবে না।

### 2) ফ্রন্টএন্ড

- ফোল্ডার: `frontend`
- `.env` (ঐচ্ছিক):

```
VITE_API_URL=http://localhost:5001/api
```

- ইনস্টল ও রান:

```
cd frontend
npm install
npm run dev
```

ব্রাউজার: `http://localhost:5173`

## API এন্ডপয়েন্ট

- POST `/api/mood` { userId, mood, note }
- GET `/api/mood/:userId`
- POST `/api/help` { category, description, location }
- GET `/api/help`

## ডিপ্লয়মেন্ট নোট

- MongoDB Atlas কানেকশন স্ট্রিং `.env` এ দিন
- Backend: Render/Railway
- Frontend: Vercel (`VITE_API_URL` প্রোডাকশন API URL দিন)


