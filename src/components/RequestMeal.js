import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Card, 
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Alert
} from '@mui/material';
import { db } from '../firebase';
import { collection, addDoc, getDocs, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from './PaymentForm';

// Add Brown's menu
const MENUS = {
  GBC: {
    breakfast: {
      mainMeals: [
        'Egg Burrito',
        'Bacon Burrito',
        'Turkey Sausage Burrito',
        'Vegan Burrito',
        'Egg Croissant',
        'Bacon Croissant',
        'Turkey Sausage Croissant'
      ],
      sides: [
        'Hash Brown Patties',
        'Fruit Cup'
      ],
      beverages: [
        'Bubly Water (12 oz.)',
        'Proud Source (12 oz.)',
        'Coffee (12 oz.)',
        'Hot Tea (12 oz.)',
        'Orange Juice (6 oz.)',
        'Milk (8 oz.)'
      ]
    },
    lunch: {
      sandwiches: [
        'Philly Cheesesteak',
        'Cheeseburger',
        'Beyond Burger',
        'Fried Chicken',
        'Salmon and Fennel Slaw'
      ],
      sides: [
        'French Fries',
        'Side Green Salad',
        'Seasonal Fruit Salad'
      ],
      otherEntrees: [
        'Mapo Tofu Bowl',
        'Ancient Grains Bowl - Chicken',
        'Ancient Grains Bowl - Salmon',
        'Ancient Grains Bowl - Tofu',
        'Buffalo Chicken Salad',
        'California Greens - Grilled Tofu',
        'California Greens - Chopped Chicken',
        'Loaded Fries - Buffalo Chicken',
        'Loaded Fries - Bulgogi',
        'Loaded Fries - Chicken Tenders',
        'Loaded Fries - Meatless Tenders'
      ],
      beverages: [
        'Bubly Water (12 oz.)',
        'Proud Source (12 oz.)',
        'Coffee (12 oz.)',
        'Hot Tea (12 oz.)',
        'Orange Juice (6 oz.)',
        'Milk (8 oz.)'
      ]
    }
  },
  Browns: {
    breakfast: {
      mainMeals: [
        'Turkey Sausage Burrito',
        'Plant-Based Chorizo Burrito (VG)',
        'Avocado Toast (V)'
      ],
      sides: [
        'Hash Brown Patty',
        'Fruit Cup'
      ],
      beverages: [
        'Bubly Water (12 oz. can)',
        'Hot Coffee (12 oz.)',
        'Hot Tea (12 oz.)',
        'Milk (8 oz.)',
        'Juice (8 oz.)'
      ]
    },
    lunch: {
      proteins: [
        'Rotisserie Tri-Tip',
        'Roasted Chicken Breast',
        'Seared Salmon Fillet',
        'Seared Tofu'
      ],
      sauces: [
        'Zesty Chimichurri',
        'Tango Ancho Orange',
        'Szechuan'
      ],
      sides: [
        'Garlic Fries',
        'Heirloom Grains',
        'Vegetable Medley',
        'Side Green Salad'
      ],
      beverages: [
        'Bubly Water (12 oz. can)',
        'Milk (8 oz.)',
        'Hot Coffee (12 oz.)',
        'Juice (8 oz.)',
        'Hot Tea (12 oz.)'
      ]
    }
  }
};

// Initialize Stripe
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

// For buyers to request meals
function RequestMeal() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState('');
  const [mealTime, setMealTime] = useState('');
  const [mainItem, setMainItem] = useState('');
  const [side, setSide] = useState('');
  const [beverage, setBeverage] = useState('');
  const [protein, setProtein] = useState('');
  const [sauce, setSauce] = useState('');
  const [secondSide, setSecondSide] = useState('');
  const [error, setError] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!restaurant || !mealTime || !beverage) {
      setError('Please select all required items');
      return;
    }

    if (restaurant === 'Browns' && mealTime === 'lunch') {
      if (!protein || !sauce || !side || !secondSide) {
        setError('Please select all required items for Brown\'s lunch');
        return;
      }
    } else {
      if (!mainItem || !side) {
        setError('Please select all required items');
        return;
      }
    }

    try {
      const orderData = {
        restaurant,
        mealTime,
        beverage,
        buyerUid: currentUser.uid,
        price: 10.00,
        createdAt: serverTimestamp(),
        status: 'pending_payment'
      };

      if (restaurant === 'Browns' && mealTime === 'lunch') {
        orderData.protein = protein;
        orderData.sauce = sauce;
        orderData.sides = [side, secondSide];
      } else {
        orderData.mainItem = mainItem;
        orderData.side = side;
      }

      const orderRef = await addDoc(collection(db, 'meal_requests'), orderData);
      setOrderId(orderRef.id);
      setShowPayment(true);
    } catch (error) {
      console.error('Error creating meal request:', error);
      setError('Failed to create order. Please try again.');
    }
  };

  const handlePaymentSuccess = async () => {
    try {
      // Update order status
      await updateDoc(doc(db, 'meal_requests', orderId), {
        status: 'paid'
      });

      // Create notifications for sellers
      const sellersSnapshot = await getDocs(collection(db, 'users'));
      sellersSnapshot.forEach(async (sellerDoc) => {
        const sellerData = sellerDoc.data();
        if (sellerData.isSeller) {
          await addDoc(collection(db, 'notifications'), {
            type: 'new_request',
            requestId: orderId,
            sellerUid: sellerDoc.id,
            buyerUid: currentUser.uid,
            restaurant: restaurant,
            mealTime: mealTime,
            mainItem: mainItem,
            side: side,
            beverage: beverage,
            status: 'unread',
            createdAt: serverTimestamp()
          });
        }
      });

      setShowPayment(false);
      navigate('/my-orders');
    } catch (error) {
      console.error('Error updating order:', error);
      setError('Payment successful but failed to update order. Please contact support.');
    }
  };

  const renderMealOptions = () => {
    if (!restaurant || !mealTime) return null;

    const menu = MENUS[restaurant][mealTime];

    if (restaurant === 'Browns' && mealTime === 'lunch') {
      return (
        <>
          <FormControl fullWidth margin="normal">
            <InputLabel>Protein (Required)</InputLabel>
            <Select
              value={protein}
              label="Protein (Required)"
              onChange={(e) => setProtein(e.target.value)}
            >
              {menu.proteins.map((item) => (
                <MenuItem key={item} value={item}>{item}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Sauce (Required)</InputLabel>
            <Select
              value={sauce}
              label="Sauce (Required)"
              onChange={(e) => setSauce(e.target.value)}
            >
              {menu.sauces.map((item) => (
                <MenuItem key={item} value={item}>{item}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>First Side (Required)</InputLabel>
            <Select
              value={side}
              label="First Side (Required)"
              onChange={(e) => setSide(e.target.value)}
            >
              {menu.sides.map((item) => (
                <MenuItem key={item} value={item}>{item}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Second Side (Required)</InputLabel>
            <Select
              value={secondSide}
              label="Second Side (Required)"
              onChange={(e) => setSecondSide(e.target.value)}
            >
              {menu.sides
                .filter(item => item !== side)
                .map((item) => (
                  <MenuItem key={item} value={item}>{item}</MenuItem>
                ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Beverage (Required)</InputLabel>
            <Select
              value={beverage}
              label="Beverage (Required)"
              onChange={(e) => setBeverage(e.target.value)}
            >
              {menu.beverages.map((item) => (
                <MenuItem key={item} value={item}>{item}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </>
      );
    }

    return (
      <>
        <FormControl fullWidth margin="normal">
          <InputLabel>Main Item (Required)</InputLabel>
          <Select
            value={mainItem}
            label="Main Item (Required)"
            onChange={(e) => setMainItem(e.target.value)}
          >
            {menu.mainMeals.map((item) => (
              <MenuItem key={item} value={item}>{item}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>Side (Required)</InputLabel>
          <Select
            value={side}
            label="Side (Required)"
            onChange={(e) => setSide(e.target.value)}
          >
            {menu.sides.map((item) => (
              <MenuItem key={item} value={item}>{item}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>Beverage (Required)</InputLabel>
          <Select
            value={beverage}
            label="Beverage (Required)"
            onChange={(e) => setBeverage(e.target.value)}
          >
            {menu.beverages.map((item) => (
              <MenuItem key={item} value={item}>{item}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </>
    );
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Request Meal
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Card>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Select Restaurant</InputLabel>
                <Select
                  value={restaurant}
                  label="Select Restaurant"
                  onChange={(e) => {
                    setRestaurant(e.target.value);
                    setMealTime('');
                    setMainItem('');
                    setSide('');
                    setBeverage('');
                    setProtein('');
                    setSauce('');
                    setSecondSide('');
                  }}
                >
                  <MenuItem value="GBC">GBC</MenuItem>
                  <MenuItem value="Browns">Brown's</MenuItem>
                </Select>
              </FormControl>

              {restaurant && (
                <FormControl fullWidth margin="normal">
                  <InputLabel>Meal Time</InputLabel>
                  <Select
                    value={mealTime}
                    label="Meal Time"
                    onChange={(e) => {
                      setMealTime(e.target.value);
                      setMainItem('');
                      setSide('');
                      setBeverage('');
                      setProtein('');
                      setSauce('');
                      setSecondSide('');
                    }}
                  >
                    <MenuItem value="breakfast">Breakfast</MenuItem>
                    {restaurant === 'GBC' && (
                      <MenuItem value="lunch">Lunch</MenuItem>
                    )}
                  </Select>
                </FormControl>
              )}

              {restaurant && mealTime && renderMealOptions()}

              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ mt: 3 }}
                disabled={!restaurant || !mealTime || !mainItem || !beverage || !side}
              >
                Request Meal ($10.00)
              </Button>
            </form>
          </CardContent>
        </Card>
      </Box>

      <Elements stripe={stripePromise}>
        <PaymentForm
          open={showPayment}
          onClose={() => setShowPayment(false)}
          amount={10.00}
          orderId={orderId}
          onSuccess={handlePaymentSuccess}
        />
      </Elements>
    </Container>
  );
}

export default RequestMeal; 