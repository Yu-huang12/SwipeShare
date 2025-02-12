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
      <Box sx={{ mt: 8, mb: 6 }}>
        <GradientText variant="h3" gutterBottom align="center">
          Create Your Order
        </GradientText>
        <Typography 
          variant="subtitle1" 
          gutterBottom 
          color="text.secondary"
          align="center"
          sx={{ 
            fontFamily: 'Inter',
            mb: 4
          }}
        >
          Ladle & Leaf • 2495 Bancroft Way, Berkeley
        </Typography>
        
        <Paper 
          elevation={0}
          sx={{ 
            p: 4,
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(166, 124, 82, 0.1)',
          }}
        >
          <form onSubmit={handleSubmit}>
            <StyledFormControl fullWidth margin="normal">
              <InputLabel>Select Category</InputLabel>
              <Select
                value={formData.category}
                label="Select Category"
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
            </StyledFormControl>

            <Fade in={Boolean(formData.category)}>
              <Box>
                {formData.category && (
                  <StyledFormControl fullWidth margin="normal">
                    <InputLabel>Select Menu Item</InputLabel>
                    <Select
                      value={formData.menuItem}
                      label="Select Menu Item"
                      onChange={(e) => setFormData({ ...formData, menuItem: e.target.value })}
                      required
                    >
                      {MENU_CATEGORIES[formData.category].map((item) => (
                        <MenuItem key={item.name} value={item.name}>
                          {item.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </StyledFormControl>
                )}
              </Box>
            </Fade>

            <Fade in={Boolean(formData.menuItem)}>
              <Box>
                {formData.menuItem && (
                  <DescriptionText variant="body2" sx={{ mt: 2, mb: 3 }}>
                    {MENU_CATEGORIES[formData.category].find(item => item.name === formData.menuItem)?.description}
                  </DescriptionText>
                )}
              </Box>
            </Fade>
            
            <StyledTextField
              fullWidth
              label="Special Instructions"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              margin="normal"
              multiline
              rows={3}
              placeholder="Any dietary preferences or special requests?"
            />
            
            <Typography 
              variant="h6" 
              sx={{ 
                mt: 3, 
                mb: 3,
                color: '#A67C52',
                fontFamily: 'Playfair Display',
                textAlign: 'center'
              }}
            >
              Total Amount: $10.00
            </Typography>
            
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={!formData.menuItem}
              sx={{ 
                py: 2,
                fontSize: '1.1rem',
                fontFamily: 'Playfair Display'
              }}
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