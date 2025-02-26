import { getFirestore, collection, addDoc, getDocs, query, where } from 'firebase/firestore';

export async function initializeStripeProduct() {
  const db = getFirestore();
  
  try {
    // Check if product already exists
    const productsRef = collection(db, 'products');
    const existingProducts = await getDocs(
      query(productsRef, where('name', '==', 'Meal Payment'))
    );

    if (existingProducts.empty) {
      // Create the meal payment product
      const productRef = await addDoc(productsRef, {
        name: 'Meal Payment',
        description: 'One-time meal payment',
        active: true,
        metadata: {
          type: 'one_time'
        }
      });

      // Create the price for the product
      await addDoc(collection(db, 'products', productRef.id, 'prices'), {
        active: true,
        currency: 'usd',
        unit_amount: 1000, // $10.00
        type: 'one_time'
      });

      console.log('Stripe product and price created successfully');
    } else {
      console.log('Stripe product already exists');
    }
  } catch (error) {
    console.error('Error initializing Stripe product:', error);
  }
} 