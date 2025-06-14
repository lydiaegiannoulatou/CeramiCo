# 🎨 CeramiCo Project

**CeramiCo** is my graduation project for **Social Hackers Academy**.

With a background in Fine Arts and a love for working with clay, I originally envisioned opening a physical pottery studio. But discovering Full Stack Development opened a new creative path — this platform blends both passions: **pottery and programming**.

---

## 🛠️ Technologies Used

### 🔧 Backend
- Node.js  
- Express  
- MongoDB  
- Mongoose  
- Bcrypt  
- Cors  
- JSON Web Token (JWT)  
- Nodemailer  
- Cloudinary  
- Stripe  

### 🎨 Frontend
- React  
- React Router DOM  
- React Toastify  
- Axios  
- Tailwind CSS  
- HTML / CSS / JavaScript  

---


---

## 🚀 Getting Started

Follow these steps to run **CeramiCo** locally on your machine.

### Prerequisites

- [Node.js](https://nodejs.org/) installed (v16 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (local or cloud instance)
- [Stripe CLI](https://stripe.com/docs/stripe-cli#install) for webhook testing  
- A Stripe account (recommended for full functionality) 
- (Optional) Cloudinary account for image hosting
- Gmail account for email notifications (used with Nodemailer)

---

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/ceramico.git
cd ceramico
```
---
### 2. Setup Environment Variables

Create .env files inside both backend and client directories, based on the .env.example file.

---
### 3. Install Dependencies

Install packages for backend and frontend:

```bash
# Backend
cd backend
npm install

# Frontend
cd ../client
npm install
```
---

### 4. Run the Application
```bash
# Backend
cd backend
npm start


# Frontend
cd ../client
npm run dev
```
 ---
### 5.Stripe Webhook Listener (for local development)

To simulate real payment events locally:

#### 1. Install Stripe CLI (if not done already):
https://stripe.com/docs/stripe-cli#install

#### 2. Run the webhook listener:
```bash
stripe listen --forward-to localhost:3050/payment/webhook
```

In order to test the payment:
 - Card Number: 4242 4242 4242 4242
 - CVC: any 3 digits
 - Date: any future date


for more information check out this : https://docs.stripe.com/testing

---

## ✅ You're Ready!
Visit http://localhost:5173 in your browser to explore CeramiCo.