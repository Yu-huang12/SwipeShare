import React, { useState } from 'react';
import { 
  Container, 
  TextField, 
  Button, 
  Typography, 
  Box, 
  MenuItem, 
  Paper, 
  Select, 
  FormControl, 
  InputLabel,
  Fade
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';

const GradientText = styled(Typography)`
  background: linear-gradient(45deg, #A67C52, #D2691E);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-family: 'Playfair Display', serif;
`;

const StyledFormControl = styled(FormControl)`
  .MuiOutlinedInput-root {
    transition: all 0.3s ease;
    border-color: rgba(166, 124, 82, 0.2);
    
    &:hover {
      border-color: rgba(166, 124, 82, 0.5);
    }
    
    &.Mui-focused {
      border-color: #A67C52;
    }
  }

  .MuiInputLabel-root {
    color: #7D6B5D;
    font-family: 'Inter', sans-serif;
    
    &.Mui-focused {
      color: #A67C52;
    }
  }

  .MuiSelect-select {
    font-family: 'Inter', sans-serif;
  }
`;

const StyledTextField = styled(TextField)`
  .MuiOutlinedInput-root {
    transition: all 0.3s ease;
    
    fieldset {
      border-color: rgba(166, 124, 82, 0.2);
    }
    
    &:hover fieldset {
      border-color: rgba(166, 124, 82, 0.5);
    }
    
    &.Mui-focused fieldset {
      border-color: #A67C52;
    }
  }

  .MuiInputLabel-root {
    color: #7D6B5D;
    font-family: 'Inter', sans-serif;
    
    &.Mui-focused {
      color: #A67C52;
    }
  }

  input, textarea {
    font-family: 'Inter', sans-serif;
  }
`;

const DescriptionText = styled(Typography)`
  color: #7D6B5D;
  font-family: 'Inter', sans-serif;
  line-height: 1.7;
  padding: 16px;
  border-radius: 8px;
  background: rgba(166, 124, 82, 0.05);
  border: 1px solid rgba(166, 124, 82, 0.1);
`;

const RESTAURANT_MENUS = {
  "Browns": {
    breakfast: [
      {
        name: "Turkey Sausage Burrito",
        description: "SCRAMBLED EGG, TURKEY SAUSAGE, POTATO, SALSA, AND JACK CHEESE",
        price: 10.00,
        includesOne: "beverage",
        includesOne: "side"
      },
      {
        name: "Plant-Based Chorizo Burrito",
        description: "PLANT-BASED CHORIZO, SCRAMBLED EGG, POTATO, SALSA, AND JACK CHEESE",
        price: 10.00,
        includesOne: "beverage",
        includesOne: "side",
        isVegan: true
      },
      {
        name: "Avocado Toast",
        description: "SMASHED AVOCADO ON TOASTED BREAD",
        price: 10.00,
        includesOne: "beverage",
        includesOne: "side",
        isVegetarian: true
      }
    ],
    breakfast_sides: [
      { name: "Hash Brown Patty", description: "CRISPY HASH BROWN PATTY" },
      { name: "Fruit Cup", description: "SEASONAL FRESH FRUIT" }
    ],
    lunch: [
      {
        name: "Rotisserie Tri Tip",
        description: "SLICED TRI TIP WITH CHOICE OF SIDE",
        price: 10.00,
        includesOne: "beverage",
        requiresSide: true
      },
      {
        name: "Roasted Chicken Breast",
        description: "ROASTED CHICKEN BREAST WITH CHOICE OF SIDE",
        price: 10.00,
        includesOne: "beverage",
        requiresSide: true
      },
      {
        name: "Seared Salmon Fillet",
        description: "SEARED SALMON FILLET WITH CHOICE OF SIDE",
        price: 10.00,
        includesOne: "beverage",
        requiresSide: true
      },
      {
        name: "Seared Tofu",
        description: "SEARED TOFU WITH CHOICE OF SIDE",
        price: 10.00,
        includesOne: "beverage",
        requiresSide: true,
        isVegetarian: true
      }
    ],
    lunch_sides: [
      { name: "Vegetable Medley", description: "SEASONAL VEGETABLE MEDLEY", isVegetarian: true },
      { name: "Salad Seasonal Greens", description: "MIXED SEASONAL GREENS", isVegetarian: true },
      { name: "Garlic Fries", description: "FRENCH FRIES WITH GARLIC SEASONING", isVegetarian: true },
      { name: "Brown Rice", description: "STEAMED BROWN RICE", isVegetarian: true }
    ],
    lunch_sauces: [
      { name: "Chimichurri" },
      { name: "Ancho Orange" },
      { name: "Szechuan" }
    ],
    beverages: [
      { name: "BUBLY WATER", size: "12 OZ" },
      { name: "HOT COFFEE", size: "12 OZ" },
      { name: "HOT TEA", size: "12 OZ" },
      { name: "MILK", size: "8 OZ" },
      { name: "JUICE", size: "8 OZ" }
    ]
  },
  "GBC": {
    breakfast: [
      {
        name: "Egg Burrito",
        description: "SCRAMBLED EGG, POTATO, SALSA, AND JACK CHEESE",
        price: 10.00,
        includesOne: "beverage"
      },
      {
        name: "Bacon Burrito",
        description: "SCRAMBLED EGG, BACON, POTATO, SALSA, AND JACK CHEESE",
        price: 10.00,
        includesOne: "beverage"
      },
      {
        name: "Turkey Sausage Burrito",
        description: "SCRAMBLED EGG, TURKEY SAUSAGE, POTATO, SALSA, AND JACK CHEESE",
        price: 10.00,
        includesOne: "beverage"
      },
      {
        name: "Vegan Burrito",
        description: "PLANT FORWARD SCRAMBLE AND CHEESE WITH POTATOES AND SALSA",
        price: 10.00,
        includesOne: "beverage"
      },
      {
        name: "Egg Croissant",
        description: "FLAKY CROISSANT WITH SCRAMBLED EGG AND CHEESE",
        price: 10.00,
        includesOne: "beverage"
      },
      {
        name: "Bacon Croissant",
        description: "FLAKY CROISSANT WITH SCRAMBLED EGG, CHEESE, AND BACON",
        price: 10.00,
        includesOne: "beverage"
      },
      {
        name: "Turkey Sausage Croissant",
        description: "FLAKY CROISSANT WITH SCRAMBLED EGG, CHEESE, AND TURKEY SAUSAGE PATTY",
        price: 10.00,
        includesOne: "beverage"
      }
    ],
    lunch: {
      sandwiches: [
        {
          name: "Philly Cheesesteak",
          description: "SIRLOIN BEEF, ONIONS, PEPPERS, AND CHEESE ON A SOFT ROLL",
          price: 10.00,
          includesSide: true,
          includesOne: "beverage"
        },
        {
          name: "Cheeseburger",
          description: "CERTIFIED HUMANE HALAL BEEF PATTY, CHEDDAR, PICKLES, AND SPECIAL SAUCE ON TOASTED BRIOCHE BUN",
          price: 10.00,
          includesSide: true,
          includesOne: "beverage"
        },
        {
          name: "Beyond Burger",
          description: "PLANT-BASED PATTY, PICKLES, VEGAN CHEESE, AND HORSERADISH DIJONNAISE ON TOASTED BUN",
          price: 10.00,
          includesSide: true,
          includesOne: "beverage"
        },
        {
          name: "Fried Chicken",
          description: "FRIED CHICKEN BREAST, PICKLES, HOT SAUCE AND HONEY SPREAD ON TOASTED BRIOCHE BUN",
          price: 10.00,
          includesSide: true,
          includesOne: "beverage"
        },
        {
          name: "Salmon and Fennel Slaw",
          description: "SEARED SALMON, FENNEL AND CABBAGE SLAW, DILL, AND CAPER YOGURT ON TOASTED BRIOCHE BUN",
          price: 10.00,
          includesSide: true,
          includesOne: "beverage"
        }
      ],
      bowls: [
        {
          name: "Mapo Tofu Bowl",
          description: "ORGANIC TOFU, ZUCCHINI, AND MUSHROOMS IN A SZECHUAN SAUCE, SERVED WITH RICE",
          price: 10.00,
          includesOne: "beverage"
        },
        {
          name: "Ancient Grains Bowl",
          description: "CHOICE OF GRILLED CHICKEN, SALMON, OR TOFU",
          price: 10.00,
          includesOne: "beverage"
        }
      ],
      loadedFries: [
        {
          name: "Buffalo Chicken",
          description: "CHICKEN TENDERS TOSSED IN A BUFFALO SAUCE, CHEDDAR CHEESE, BACON, AND RANCH DRESSING ON FRENCH FRIES",
          price: 10.00,
          includesOne: "beverage"
        },
        {
          name: "Bulgogi",
          description: "BULGOGI BEEF, KIMCHI, GREEN ONION, SESAME SEED WITH GOCHUJANG KEWPIE SAUCE ON FRENCH FRIES",
          price: 10.00,
          includesOne: "beverage"
        },
        {
          name: "Chicken Tenders",
          description: "CHICKEN TENDERS ON FRENCH FRIES",
          price: 10.00,
          includesOne: "beverage"
        },
        {
          name: "Meatless Tenders",
          description: "REBELLYOUS PLANT-BASED TENDERS ON FRENCH FRIES",
          price: 10.00,
          includesOne: "beverage"
        }
      ],
      salads: [
        {
          name: "California Greens Salad",
          description: "SEASONAL MIXED GREENS, CUCUMBER, CHERRY TOMATO, CARROT, ARTICHOKE HEARTS, OLIVES, FETA CHEESE, AND CROUTONS",
          price: 10.00,
          includesOne: "beverage",
          requiresProtein: true,
          requiresDressing: true
        }
      ]
    },
    sides: [
      { name: "French Fries", description: "FRENCH FRIES WITH SEASONING" },
      { name: "Side Green Salad", description: "SEASONAL GREENS WITH CUCUMBERS, CHERRY TOMATOES, AND CARROTS", requiresDressing: true },
      { name: "Seasonal Fruit Salad", description: "HAND-CUT AND CHILLED SEASONAL FRUITS" }
    ],
    proteins: [
      { name: "GRILLED TOFU" },
      { name: "CHOPPED CHICKEN TENDERS" }
    ],
    dressings: [
      { name: "RANCH" },
      { name: "CAESAR" },
      { name: "VINAIGRETTE" }
    ],
    beverages: [
      { name: "BUBLY WATER", size: "12 OZ" },
      { name: "PROUD SOURCE", size: "12 OZ" },
      { name: "COFFEE", size: "12 OZ" },
      { name: "HOT TEA", size: "12 OZ" },
      { name: "ORANGE JUICE", size: "8 OZ" },
      { name: "MILK", size: "8 OZ" }
    ]
  }
};

function getCurrentMealTime() {
  const now = new Date();
  const hour = now.getHours();
  const day = now.getDay(); // 0 is Sunday, 6 is Saturday

  // Check if it's Sunday (0) or Saturday (6)
  if (day === 0 || day === 6) {
    return null; // Closed on weekends
  }

  // Breakfast is 7:30 AM - 10:00 AM
  if (hour >= 7 && hour < 10) {
    return 'breakfast';
  }
  
  // Lunch is 11:00 AM - 4:30 PM for Browns, 11:00 AM - 7:00 PM for GBC
  if (hour >= 11 && hour < 16) { // 4:30 PM for Browns
    return 'lunch';
  }

  return null; // Outside operating hours
}

function CreateOrder() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    restaurant: '',
    menuItem: '',
    beverage: '',
    side: '',
    sides: ['', ''],
    sauce: '',
    dressing: '',
    protein: '',
    status: 'pending'
  });
  const currentMealTime = getCurrentMealTime();

  // Helper function to get menu items based on restaurant and meal time
  const getMenuItems = () => {
    if (!formData.restaurant || !currentMealTime) return [];
    
    if (formData.restaurant === "Browns") {
      return RESTAURANT_MENUS[formData.restaurant][currentMealTime];
    }
    
    // Handle GBC menu structure
    if (formData.restaurant === "GBC") {
      if (currentMealTime === "breakfast") {
        return RESTAURANT_MENUS.GBC.breakfast;
      } else {
        // Combine all lunch items
        return [
          ...RESTAURANT_MENUS.GBC.lunch.sandwiches,
          ...RESTAURANT_MENUS.GBC.lunch.bowls,
          ...RESTAURANT_MENUS.GBC.lunch.loadedFries,
          ...RESTAURANT_MENUS.GBC.lunch.salads
        ];
      }
    }
  };

  // Helper function to check if item is a sandwich
  const isSandwich = (itemName) => {
    return RESTAURANT_MENUS.GBC.lunch.sandwiches.some(
      sandwich => sandwich.name === itemName
    );
  };

  // Helper to check if item is a salad
  const isSalad = (itemName) => {
    return RESTAURANT_MENUS.GBC.lunch.salads?.some(
      salad => salad.name === itemName
    );
  };

  // Helper to check if side/item needs dressing
  const needsDressing = (itemName) => {
    if (isSalad(itemName)) return true;
    
    const selectedSide = RESTAURANT_MENUS.GBC.sides.find(
      side => side.name === itemName
    );
    return selectedSide?.requiresDressing || false;
  };

  // Add side selection for sandwiches
  const renderSideSelection = () => {
    if (formData.restaurant === "GBC" && 
        currentMealTime === "lunch" && 
        formData.menuItem && 
        isSandwich(formData.menuItem)) {
      return (
        <StyledFormControl fullWidth margin="normal">
          <InputLabel>Select Side</InputLabel>
          <Select
            value={formData.side}
            label="Select Side"
            onChange={(e) => setFormData({ ...formData, side: e.target.value })}
            required
          >
            {RESTAURANT_MENUS.GBC.sides.map((side) => (
              <MenuItem key={side.name} value={side.name}>
                {side.name}
              </MenuItem>
            ))}
          </Select>
        </StyledFormControl>
      );
    }
    return null;
  };

  // Render dressing selection
  const renderDressingSelection = () => {
    if (formData.restaurant === "GBC" && 
        (needsDressing(formData.menuItem) || needsDressing(formData.side))) {
      return (
        <StyledFormControl fullWidth margin="normal">
          <InputLabel>Select Dressing</InputLabel>
          <Select
            value={formData.dressing}
            label="Select Dressing"
            onChange={(e) => setFormData({ ...formData, dressing: e.target.value })}
            required
          >
            {RESTAURANT_MENUS.GBC.dressings.map((dressing) => (
              <MenuItem key={dressing.name} value={dressing.name}>
                {dressing.name}
              </MenuItem>
            ))}
          </Select>
        </StyledFormControl>
      );
    }
    return null;
  };

  // Render protein selection for salads
  const renderProteinSelection = () => {
    const selectedItem = getMenuItems()?.find(item => item.name === formData.menuItem);
    if (formData.restaurant === "GBC" && selectedItem?.requiresProtein) {
      return (
        <StyledFormControl fullWidth margin="normal">
          <InputLabel>Select Protein</InputLabel>
          <Select
            value={formData.protein}
            label="Select Protein"
            onChange={(e) => setFormData({ ...formData, protein: e.target.value })}
            required
          >
            {RESTAURANT_MENUS.GBC.proteins.map((protein) => (
              <MenuItem key={protein.name} value={protein.name}>
                {protein.name}
              </MenuItem>
            ))}
          </Select>
        </StyledFormControl>
      );
    }
    return null;
  };

  // Update the renderBrownsSideSelection function to handle multiple side selections
  const renderBrownsSideSelection = () => {
    if (formData.restaurant === "Browns" && formData.menuItem) {
      const sidesKey = currentMealTime === "breakfast" ? "breakfast_sides" : "lunch_sides";
      const sides = RESTAURANT_MENUS.Browns[sidesKey] || [];

      if (currentMealTime === "lunch") {
        // For lunch, require exactly 2 sides
        const [side1, side2] = formData.sides || ['', ''];
        
        return (
          <Box>
            <Typography variant="subtitle1" color="error" sx={{ mb: 2 }}>
              Choose 2 Sides (Required)
            </Typography>
            
            <StyledFormControl fullWidth margin="normal">
              <InputLabel>Select First Side</InputLabel>
              <Select
                value={side1}
                label="Select First Side"
                onChange={(e) => {
                  const newSides = [e.target.value, side2];
                  setFormData({ ...formData, sides: newSides });
                }}
                required
              >
                {sides.map((side) => (
                  <MenuItem 
                    key={side.name} 
                    value={side.name}
                    disabled={side.name === side2} // Prevent selecting same side twice
                  >
                    {side.name}
                    {side.isVegetarian && " (V)"}
                  </MenuItem>
                ))}
              </Select>
            </StyledFormControl>

            <StyledFormControl fullWidth margin="normal">
              <InputLabel>Select Second Side</InputLabel>
              <Select
                value={side2}
                label="Select Second Side"
                onChange={(e) => {
                  const newSides = [side1, e.target.value];
                  setFormData({ ...formData, sides: newSides });
                }}
                required
              >
                {sides.map((side) => (
                  <MenuItem 
                    key={side.name} 
                    value={side.name}
                    disabled={side.name === side1} // Prevent selecting same side twice
                  >
                    {side.name}
                    {side.isVegetarian && " (V)"}
                  </MenuItem>
                ))}
              </Select>
            </StyledFormControl>
          </Box>
        );
      } else {
        // For breakfast, keep single side selection
        return (
          <StyledFormControl fullWidth margin="normal">
            <InputLabel>Select Side</InputLabel>
            <Select
              value={formData.side}
              label="Select Side"
              onChange={(e) => setFormData({ ...formData, side: e.target.value })}
              required
            >
              {sides.map((side) => (
                <MenuItem key={side.name} value={side.name}>
                  {side.name}
                </MenuItem>
              ))}
            </Select>
          </StyledFormControl>
        );
      }
    }
    return null;
  };

  // Update the form to include Browns beverage selection
  const renderBrownsBeverageSelection = () => {
    if (formData.restaurant === "Browns" && formData.menuItem) {
      return (
        <StyledFormControl fullWidth margin="normal">
          <InputLabel>Select Beverage</InputLabel>
          <Select
            value={formData.beverage}
            label="Select Beverage"
            onChange={(e) => setFormData({ ...formData, beverage: e.target.value })}
            required
          >
            {RESTAURANT_MENUS.Browns.beverages.map((beverage) => (
              <MenuItem key={beverage.name} value={beverage.name}>
                {beverage.name} ({beverage.size})
              </MenuItem>
            ))}
          </Select>
        </StyledFormControl>
      );
    }
    return null;
  };

  // Add sauce selection render function
  const renderBrownsSauceSelection = () => {
    if (formData.restaurant === "Browns" && currentMealTime === "lunch" && formData.menuItem) {
      return (
        <StyledFormControl fullWidth margin="normal">
          <InputLabel>Select Sauce</InputLabel>
          <Select
            value={formData.sauce}
            label="Select Sauce"
            onChange={(e) => setFormData({ ...formData, sauce: e.target.value })}
            required
          >
            {RESTAURANT_MENUS.Browns.lunch_sauces.map((sauce) => (
              <MenuItem key={sauce.name} value={sauce.name}>
                {sauce.name}
              </MenuItem>
            ))}
          </Select>
        </StyledFormControl>
      );
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const menuItems = getMenuItems();
      const selectedItem = menuItems.find(item => item.name === formData.menuItem);
      
      await addDoc(collection(db, 'orders'), {
        ...formData,
        price: 10.00,
        description: selectedItem.description,
        mealTime: currentMealTime,
        includesSide: selectedItem.includesSide || false,
        createdBy: currentUser.uid,
        createdAt: serverTimestamp()
      });
      navigate('/my-orders');
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 6 }}>
        <GradientText variant="h3" gutterBottom align="center">
          Create Your Order
        </GradientText>

        {!currentMealTime ? (
          <Typography variant="h6" color="error" align="center">
            Ordering is only available during:
            <br />
            Breakfast: 7:30 AM - 10:00 AM
            <br />
            Lunch: 11:00 AM - 4:30 PM (Browns) / 7:00 PM (GBC)
            <br />
            Monday through Friday
          </Typography>
        ) : (
          <Paper elevation={0} sx={{ p: 4, borderRadius: 2 }}>
            <form onSubmit={handleSubmit}>
              <StyledFormControl fullWidth margin="normal">
                <InputLabel>Select Restaurant</InputLabel>
                <Select
                  value={formData.restaurant}
                  label="Select Restaurant"
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    restaurant: e.target.value,
                    menuItem: '',
                    beverage: '',
                    side: '',
                    dressing: '',
                    protein: ''
                  })}
                  required
                >
                  {Object.keys(RESTAURANT_MENUS).map((restaurant) => (
                    <MenuItem key={restaurant} value={restaurant}>
                      {restaurant}
                    </MenuItem>
                  ))}
                </Select>
              </StyledFormControl>

              {formData.restaurant && (
                <StyledFormControl fullWidth margin="normal">
                  <InputLabel>Select Menu Item</InputLabel>
                  <Select
                    value={formData.menuItem}
                    label="Select Menu Item"
                    onChange={(e) => setFormData({ ...formData, menuItem: e.target.value, side: '' })}
                    required
                  >
                    {getMenuItems().map((item) => (
                      <MenuItem key={item.name} value={item.name}>
                        {item.name} - $10.00
                      </MenuItem>
                    ))}
                  </Select>
                </StyledFormControl>
              )}

              {formData.menuItem && (
                <>
                  {renderBrownsBeverageSelection()}
                  {renderBrownsSauceSelection()}
                  {renderBrownsSideSelection()}
                  {renderSideSelection()}
                </>
              )}

              {formData.menuItem && (
                <Box sx={{ mt: 2, mb: 3 }}>
                  <DescriptionText variant="body2">
                    {getMenuItems().find(item => item.name === formData.menuItem)?.description}
                    {formData.restaurant === "GBC" && currentMealTime === "lunch" && 
                     getMenuItems().find(item => item.name === formData.menuItem)?.includesSide && 
                     " (Includes French Fries)"}
                  </DescriptionText>
                </Box>
              )}

              {renderProteinSelection()}
              {renderDressingSelection()}

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={
                  !formData.menuItem || 
                  !formData.beverage ||
                  (formData.restaurant === "Browns" && currentMealTime === "lunch" && 
                   (!formData.sides || formData.sides.some(side => !side) || !formData.sauce))
                }
                sx={{ mt: 3 }}
              >
                Place Order
              </Button>
            </form>
          </Paper>
        )}
      </Box>
    </Container>
  );
}

export default CreateOrder; 