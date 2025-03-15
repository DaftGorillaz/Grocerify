# Grocery Shopping App

This is a React implementation of a grocery shopping app design from Figma. The app features a clean, modern UI with multiple screens:

## Home Screen
- User greeting and location
- Search bar with filter option
- Promotional banner
- Category cards for History, Shopping List, and Favorites
- Bottom navigation with Home, Shopping, Favourite, and Account tabs

## Shopping List Screen
- Shopping list with removable items (click the cross icon to remove)
- Recipe sections with ingredients
- Ability to remove entire recipes or individual ingredients
- Add Item button to add new items to the list
- Add Recipe button to add new recipes with ingredients
- Go button to view price comparisons for items in your shopping list
- Bottom navigation with active tab highlighting

## Product Details Screen
- Side-by-side price comparison between Woolworths and Coles
- Best value product displayed prominently on the left side
- Store logos for each product
- Product information including name, size, and price
- Add button for each product
- More Options section for additional product alternatives
- Generate button to create a shopping list with options for:
  - Shopping at a single store (Woolworths or Coles)
  - Shopping at multiple stores for the best value
- All items from shopping list displayed in a single scrollable page
- Back navigation to return to the Shopping List

## Generated Shopping List Screen
- Displays items organized by store
- For single-store lists, shows all items from the selected store
- For multi-store lists, shows best value items from each store
- Options to save the list or add it to favorites
- Back navigation to return to the Product Details screen

## Features
- Add and remove individual items from the shopping list
- Add new recipes with multiple ingredients
- Remove entire recipes or just specific ingredients
- View side-by-side price comparisons between major supermarkets
- Compare prices across different stores
- Identify best value products
- Generate optimized shopping lists based on preferences:
  - Single store for convenience
  - Multiple stores for best value
- Save and favorite shopping lists
- Navigate between screens
- Interactive UI elements

## Getting Started

To run this project locally:

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm start
   ```

## Design Implementation

This project is a faithful implementation of the provided Figma design, including:

- Color scheme
- Typography
- Layout and spacing
- Interactive elements
- Navigation between screens
- Responsive design

## Technologies Used

- React
- React Router for navigation
- React Hooks for state management
- HTML5
- CSS3
- Figma (for design reference)

## Project Structure

- `src/components/`: React components
- `src/assets/images/`: Images and icons
- `public/`: Static files 