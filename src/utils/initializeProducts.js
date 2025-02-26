import { getFirestore, collection, addDoc } from 'firebase/firestore';

export async function initializeProducts() {
  const db = getFirestore();
  
  try {
    // Create the meal payment product
    const productRef = await addDoc(collection(db, 'products'), {
      active: true,
      name: 'Meal Payment',
      description: 'One-time meal payment',
      metadata: {
        type: 'one_time'
      }
    });

    // Create the price for the product
    await addDoc(collection(db, 'products', productRef.id, 'prices'), {
      active: true,
      currency: 'usd',
      unit_amount: 1000, // $10.00
      type: 'one_time',
      metadata: {
        type: 'one_time'
      }
    });

    console.log('Product and price created successfully');
  } catch (error) {
    console.error('Error creating product:', error);
  }
} 