import { getFirestore, collection, addDoc } from 'firebase/firestore';

const db = getFirestore();

// Create a meal product
await addDoc(collection(db, 'products'), {
  name: 'Meal Payment',
  description: 'Payment for meal request',
  prices: [{
    unit_amount: 1000, // $10.00 in cents
    currency: 'usd',
    type: 'one_time'
  }]
}); 