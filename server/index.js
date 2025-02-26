const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const admin = require('firebase-admin');

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: 'your-firebase-database-url'
});

// Create payment intent
app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { amount } = req.body;
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd'
    });

    res.json({ 
      clientSecret: paymentIntent.client_secret 
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create Stripe Connect account
app.post('/create-connect-account', async (req, res) => {
  try {
    const { userId, email } = req.body;

    // Create Stripe account
    const account = await stripe.accounts.create({
      type: 'express',
      email: email,
      metadata: { firebaseUID: userId }
    });

    // Save Stripe account ID to user document
    await admin.firestore()
      .collection('users')
      .doc(userId)
      .update({
        stripeAccountId: account.id
      });

    // Create account link for onboarding
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${process.env.FRONTEND_URL}/profile`,
      return_url: `${process.env.FRONTEND_URL}/profile`,
      type: 'account_onboarding',
    });

    res.json({ accountLink: accountLink.url });
  } catch (error) {
    console.error('Error creating Connect account:', error);
    res.status(500).json({ error: error.message });
  }
});

// Handle successful payment
app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    const orderId = paymentIntent.metadata.orderId;

    try {
      // Update order with payment details
      await admin.firestore()
        .collection('meal_requests')
        .doc(orderId)
        .update({
          status: 'paid',
          paymentId: paymentIntent.id,
          amount: paymentIntent.amount,
          paidAt: admin.firestore.FieldValue.serverTimestamp()
        });

      // Optional: Track payment in a separate collection
      await admin.firestore()
        .collection('payments')
        .add({
          orderId: orderId,
          paymentIntentId: paymentIntent.id,
          amount: paymentIntent.amount,
          status: 'received',
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        });

    } catch (error) {
      console.error('Error processing payment:', error);
    }
  }

  res.json({ received: true });
});

// Add these endpoints to handle different payment methods
app.post('/api/venmo-webhook', async (req, res) => {
  // Handle Venmo webhook
});

app.post('/api/cashapp-webhook', async (req, res) => {
  // Handle Cash App webhook
});

app.post('/api/zelle-webhook', async (req, res) => {
  // Handle Zelle webhook
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 