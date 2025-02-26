const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

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

exports.notifyNewMealRequest = functions.firestore
  .document('meal_requests/{requestId}')
  .onCreate(async (snap, context) => {
    const request = snap.data();
    
    // Get all sellers
    const sellersSnapshot = await admin.firestore()
      .collection('users')
      .where('isSeller', '==', true)
      .get();
    
    const notifications = [];
    
    sellersSnapshot.forEach(sellerDoc => {
      const sellerData = sellerDoc.data();
      if (sellerData.fcmToken) {
        notifications.push({
          token: sellerData.fcmToken,
          notification: {
            title: 'New Meal Request!',
            body: `${request.restaurant} - ${request.mealTime}`
          },
          data: {
            requestId: context.params.requestId,
            restaurant: request.restaurant,
            mealTime: request.mealTime
          }
        });
      }
    });

    // Send notifications
    const messaging = admin.messaging();
    await Promise.all(notifications.map(n => messaging.send(n)));
}); 