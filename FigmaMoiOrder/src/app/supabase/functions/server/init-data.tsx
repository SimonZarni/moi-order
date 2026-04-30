// This file contains initialization functions to populate the database with restaurant data
import * as kv from "./kv_store.tsx";

export const initializeRestaurants = async () => {
  console.log('initializeRestaurants: Starting...');
  
  const restaurants = [
    {
      id: '1',
      name: 'Rangoon Tea House',
      cuisine: 'Burmese',
      rating: 4.8,
      deliveryTime: '25-35 min',
      deliveryFee: 2.99,
      image: 'https://images.unsplash.com/photo-1684374190298-8ffe1a0597fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXJtZXNlJTIwdGVhJTIwc2FsYWR8ZW58MXx8fHwxNzY0NjcwMDcwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      distance: '0.8 km',
      isOpen: true,
      menu: [
        {
          id: 'rth-1',
          name: 'Tea Leaf Salad',
          description: 'Traditional Burmese fermented tea leaf salad with crispy beans, nuts and vegetables',
          price: 8.99,
          image: 'https://images.unsplash.com/photo-1645712429415-e613305e2300?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWElMjBsZWFmJTIwc2FsYWR8ZW58MXx8fHwxNzY0NjcwMzQ3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
          category: 'Appetizers',
          available: true
        },
        {
          id: 'rth-2',
          name: 'Mohinga',
          description: 'Classic Burmese rice noodle soup with fish broth, banana stem, and crispy fritters',
          price: 9.99,
          image: 'https://images.unsplash.com/photo-1540217497311-c240a051dcb7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXJtZXNlJTIwbW9oaW5nYXxlbnwxfHx8fDE3NjQ2NzAzNDd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
          category: 'Main Dishes',
          available: true
        },
        {
          id: 'rth-3',
          name: 'Burmese Samosa',
          description: 'Crispy pastry filled with spiced potatoes, peas, and onions served with tangy tamarind sauce',
          price: 6.99,
          image: 'https://images.unsplash.com/photo-1763161693002-de3643c9cf2a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYW1vc2ElMjBwYXN0cnl8ZW58MXx8fHwxNzY0NjU4NjY5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
          category: 'Appetizers',
          available: true
        }
      ]
    },
    {
      id: '2',
      name: 'YKKO',
      cuisine: 'Noodles',
      rating: 4.7,
      deliveryTime: '20-30 min',
      deliveryFee: 1.99,
      image: 'https://images.unsplash.com/photo-1635685296916-95acaf58471f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMG5vb2RsZXN8ZW58MXx8fHwxNzY0NTc1NTQ4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      distance: '1.2 km',
      isOpen: true,
      menu: [
        {
          id: 'ykko-1',
          name: 'Signature Ramen',
          description: 'Rich tonkotsu broth with tender pork belly, soft-boiled egg, bamboo shoots, and scallions',
          price: 12.99,
          image: 'https://images.unsplash.com/photo-1653697469316-955d5ebe5994?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyYW1lbiUyMG5vb2RsZXMlMjBib3dsfGVufDF8fHx8MTc2NDU2MzA0MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
          category: 'Noodles',
          available: true
        },
        {
          id: 'ykko-2',
          name: 'Crispy Dumplings',
          description: 'Pan-fried pork dumplings with a crispy bottom, served with chili vinegar sauce',
          price: 7.99,
          image: 'https://images.unsplash.com/photo-1594225538408-17c56b2ed3c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmllZCUyMGR1bXBsaW5nc3xlbnwxfHx8fDE3NjQ2NzAzNDh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
          category: 'Appetizers',
          available: true
        },
        {
          id: 'ykko-3',
          name: 'Wonton Soup',
          description: 'Delicate pork wontons in a clear chicken broth with bok choy and sesame oil',
          price: 8.99,
          image: 'https://images.unsplash.com/photo-1736631879709-ee5341d7d31c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMHNvdXB8ZW58MXx8fHwxNzY0NTc1MDczfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
          category: 'Soups',
          available: true
        }
      ]
    },
    {
      id: '3',
      name: 'Khaing Khaing Kyaw',
      cuisine: 'Burmese',
      rating: 4.6,
      deliveryTime: '30-40 min',
      deliveryFee: 2.49,
      image: 'https://images.unsplash.com/photo-1713759980610-5a3b72d7f9d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMHJpY2UlMjBkaXNofGVufDF8fHx8MTc2NDU3NjYyNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      distance: '1.5 km',
      isOpen: true,
      menu: [
        {
          id: 'kkk-1',
          name: 'Burmese Curry Set',
          description: 'Choice of chicken, pork, or fish curry with rice, soup, salad, and side vegetables',
          price: 11.99,
          image: 'https://images.unsplash.com/photo-1666251214795-a1296307d29c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXJtZXNlJTIwY3VycnklMjByaWNlfGVufDF8fHx8MTc2NDY3MDM0OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
          category: 'Main Dishes',
          available: true
        },
        {
          id: 'kkk-2',
          name: 'Shan Noodles',
          description: 'Rice noodles with chicken in a tangy tomato sauce, topped with crispy garlic and peanuts',
          price: 9.99,
          image: 'https://images.unsplash.com/photo-1637235549417-9a949b893b04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaGFuJTIwbm9vZGxlc3xlbnwxfHx8fDE3NjQ2NzAzNDl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
          category: 'Noodles',
          available: true
        },
        {
          id: 'kkk-3',
          name: 'Spring Rolls',
          description: 'Fresh spring rolls with vegetables, herbs, and your choice of shrimp or tofu',
          price: 6.99,
          image: 'https://images.unsplash.com/photo-1761315413700-94180544376e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMHNwcmluZyUyMHJvbGxzfGVufDF8fHx8MTc2NDY3MDM0OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
          category: 'Appetizers',
          available: true
        }
      ]
    }
  ];

  console.log(`initializeRestaurants: Storing ${restaurants.length} restaurants...`);
  
  // Store each restaurant
  for (const restaurant of restaurants) {
    try {
      console.log(`Storing restaurant: ${restaurant.id} - ${restaurant.name}`);
      await kv.set(`restaurant:${restaurant.id}`, restaurant);
      console.log(`Successfully stored restaurant: ${restaurant.id}`);
    } catch (error) {
      console.error(`Failed to store restaurant ${restaurant.id}:`, error);
      throw new Error(`Failed to store restaurant ${restaurant.name}: ${error?.message || String(error)}`);
    }
  }

  // Store restaurant IDs list
  console.log('Storing restaurant IDs list...');
  const restaurantIds = restaurants.map(r => r.id);
  try {
    await kv.set('restaurants:all', restaurantIds);
    console.log('Restaurant IDs list stored successfully');
  } catch (error) {
    console.error('Failed to store restaurant IDs list:', error);
    throw new Error(`Failed to store restaurant IDs list: ${error?.message || String(error)}`);
  }

  console.log('Restaurants initialized successfully');
  return restaurants;
};
