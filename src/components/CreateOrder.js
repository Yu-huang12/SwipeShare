import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, MenuItem, Paper, Select, FormControl, InputLabel } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const MENU_CATEGORIES = {
  'Half Sandwich + Half Soups & Beverage': [
    {
      name: '1/2 Turkey Pesto Sandwich + 1/2 Soup + Beverage',
      description: 'Turkey, pesto, romaine, tomato and mayo on roll.'
    },
    {
      name: '1/2 Avocado Cheddar Cheese Sandwich + 1/2 Soup + Beverage',
      description: 'Avocado, cheddar cheese, English cucumbers, tomatoes brushed with meyer lemon vinaigrette on roll.'
    }
  ],
  'Half Salads + Half Soup + Beverage': [
    {
      name: '1/2 Asian Chicken or Tofu Salad + 1/2 Soup + Beverage',
      description: 'Organic mixed greens, certified humane antibiotic free chicken or organic tofu, edamame, carrots, cabbage & wonton strips with miso sesame vinaigrette. Served with a bread roll.'
    },
    {
      name: '1/2 Brussels, Kale & Quinoa Salad + 1/2 Soup + Beverage',
      description: 'Massaged kale, shaved brussels sprouts, tri-color quinoa, carrots, granny smith apples, cabbage, dried cranberries, feta & toasted pumpkin seeds with meyer lemon vinaigrette. Served with a bread roll.'
    }
  ],
  'Full Salads + Beverage': [
    {
      name: 'Asian Chicken or Tofu Salad + Beverage',
      description: 'Organic mixed greens, certified humane antibiotic free chicken or organic tofu, edamame, carrots, cabbage & wonton strips with miso sesame vinaigrette. Served with a bread roll.'
    },
    {
      name: 'Brussels, Kale & Quinoa Salad + Beverage',
      description: 'Massaged kale, shaved brussels sprouts, tri-color quinoa, carrots, granny smith apples, cabbage, dried cranberries, feta & toasted pumpkin seeds with meyer lemon vinaigrette. Served with a bread roll.'
    }
  ],
  'Grain Bowls + Beverage': [
    {
      name: 'Riced Cauliflower & Hummus Grain Bowl + Beverage',
      description: 'Cauliflower rice, tri-color quinoa, hummus, feta, organic mixed greens, shaved brussels sprouts, cranberry beet relish & toasted pumpkin seeds with pomegranate vinaigrette. Served with a bread roll.'
    },
    {
      name: 'Quinoa Feta Avocado Grain Bowl + Beverage',
      description: 'Tri-color quinoa, organic mixed greens, avocado, feta, English cucumbers & red bell peppers with green goddess dressing. Served with a bread roll.'
    }
  ]
};

function CreateOrder() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    category: '',
    menuItem: '',
    notes: '',
    status: 'pending'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const selectedItem = MENU_CATEGORIES[formData.category].find(
        item => item.name === formData.menuItem
      );
      
      await addDoc(collection(db, 'orders'), {
        ...formData,
        restaurant: 'Ladle & Leaf',
        items: formData.menuItem,
        description: selectedItem.description,
        price: 10.00,
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
      <Box sx={{ 
        mt: 4,
        '& .MuiPaper-root': {
          background: 'rgba(19, 47, 76, 0.4)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.1)',
        }
      }}>
        <Typography variant="h4" gutterBottom>
          Ladle & Leaf - Order
        </Typography>
        <Typography variant="subtitle1" gutterBottom color="text.secondary">
          2495 Bancroft Way, Berkeley, California
        </Typography>
        <Paper sx={{ 
          p: 4,
          borderRadius: 3,
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        }}>
          <form onSubmit={handleSubmit}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Category</InputLabel>
              <Select
                value={formData.category}
                label="Category"
                onChange={(e) => setFormData({ 
                  ...formData, 
                  category: e.target.value,
                  menuItem: '' 
                })}
                required
              >
                {Object.keys(MENU_CATEGORIES).map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {formData.category && (
              <FormControl fullWidth margin="normal">
                <InputLabel>Menu Item</InputLabel>
                <Select
                  value={formData.menuItem}
                  label="Menu Item"
                  onChange={(e) => setFormData({ ...formData, menuItem: e.target.value })}
                  required
                >
                  {MENU_CATEGORIES[formData.category].map((item) => (
                    <MenuItem key={item.name} value={item.name}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            {formData.menuItem && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2, mb: 2 }}>
                {MENU_CATEGORIES[formData.category].find(item => item.name === formData.menuItem)?.description}
              </Typography>
            )}
            
            <TextField
              fullWidth
              label="Additional Notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              margin="normal"
              multiline
              rows={2}
              placeholder="Any special requests or notes?"
            />
            
            <Typography variant="h6" color="primary" sx={{ mt: 2, mb: 2 }}>
              Price: $10.00
            </Typography>
            
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ 
                mt: 3,
                height: 48,
                background: 'linear-gradient(45deg, #6C63FF 30%, #FF6584 90%)',
                boxShadow: '0 3px 5px 2px rgba(108, 99, 255, .3)',
              }}
              disabled={!formData.menuItem}
            >
              Place Order
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
}

export default CreateOrder; 