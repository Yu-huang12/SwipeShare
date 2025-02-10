import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('your_publishable_key');

const API_URL = process.env.REACT_APP_API_URL || 'https://your-backend-url.onrender.com';

export const processPayment = async (orderId, amount) => {
  try {
    const stripe = await stripePromise;
    
    // Create payment intent on your backend
    const response = await fetch(`${API_URL}/api/create-payment-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderId,
        amount,
      }),
    });
    
    const data = await response.json();
    
    // Confirm payment with Stripe
    const result = await stripe.confirmCardPayment(data.clientSecret, {
      payment_method: {
        card: elements.getElement('card'),
        billing_details: {
          name: 'User Name',
        },
      },
    });
    
    if (result.error) {
      throw new Error(result.error.message);
    }
    
    return result.paymentIntent;
  } catch (error) {
    console.error('Payment error:', error);
    throw error;
  }
}; 