Node.js HW — Auth, Password Reset, Avatar Upload

Requirements

- Node 18+
- MongoDB (Atlas)
- SMTP (Brevo)
- Cloudinary

Env variables (.env)

- PORT, MONGO_URL, NODE_ENV
- JWT_SECRET
- FRONTEND_DOMAIN (e.g. http://localhost:3001)
- SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM
- CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET

Run

- npm install
- npm run start

Auth flow

1. POST /auth/register { email, password }
2. POST /auth/login { email, password }
3. POST /auth/logout
4. POST /auth/refresh

Password reset

1. POST /auth/request-reset-email { email }
   - Sends email with link: `${FRONTEND_DOMAIN}/reset-password?token=<JWT>`
2. POST /auth/reset-password { token, password }

Notes (protected)

- All /notes routes require cookies (accessToken) and operate only on current user's notes.

Avatar upload (protected)

- PATCH /users/me/avatar (multipart/form-data; field: avatar)
- Uses multer memoryStorage (2MB), Cloudinary upload, responds with { url }

Dev tips

- Cookies: in development secure=false, sameSite=lax for easier local testing.
- CORS: origin from FRONTEND_DOMAIN and credentials: true.
