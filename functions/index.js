exports.sendOrderNotification = functions.firestore
  .document('orders/{orderId}')
  .onCreate(async (snap, context) => {
    const order = snap.data();
    
    // Get seller's FCM token
    const sellerDoc = await admin.firestore()
      .collection('users')
      .doc(order.sellerUid)
      .get();
    
    const fcmToken = sellerDoc.data().fcmToken;
    
    if (fcmToken) {
      const message = {
        notification: {
          title: 'New Order!',
          body: `You have a new order for ${order.restaurant} ${order.mealTime}`
        },
        token: fcmToken
      };

      try {
        await admin.messaging().send(message);
      } catch (error) {
        console.error('Error sending notification:', error);
      }
    }
  }); 