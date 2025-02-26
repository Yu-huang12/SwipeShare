import { loadStripe } from '@stripe/stripe-js';

const API_URL = process.env.REACT_APP_API_URL;

export const processPayment = async (orderId, amount, stripe, elements) => {
  try {
    // Get payment method from card element
    const { error: submitError, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement('card'),
    });

    if (submitError) {
      throw new Error(submitError.message);
    }

    // Create payment intent
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/create-payment-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        orderId,
      }),
    });

    const { clientSecret } = await response.json();

    // Confirm payment
    const { error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: paymentMethod.id,
    });

    if (confirmError) {
      throw new Error(confirmError.message);
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}; 