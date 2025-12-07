/**
 * app.js
 * 
 * This file contains all Phase 1 UI logic:
 * - Renders the menu from mock data
 * - Handles collapsible categories
 * - Handles live search
 * - Handles switching between customer and admin views
 */

console.log('app.js is running');

// Store original menu data for filtering
let originalMenuData = null;

// Read menu data on page load
document.addEventListener('DOMContentLoaded', function() {
  if (window.menuData) {
    console.log('Menu data loaded:', window.menuData);
    console.log('Categories:', window.menuData.categories);
    console.log('Menu items:', window.menuData.menuItems);
    
    // Store original data
    originalMenuData = window.menuData;
    
    // Render the menu with full data
    renderMenu(originalMenuData);
    
    // Set up search functionality
    setupSearch();
  } else {
    console.error('Menu data not found. Make sure menu-mock-data.js is loaded before app.js.');
  }
});

/**
 * Renders the menu based on provided menu data
 * @param {Object} menuData - The menu data object containing categories and menuItems
 * @param {boolean} isSearchMode - If true, shows only items without category headers
 * 
 * Filtering behavior: 
 * - In normal mode: Categories with zero matching items are hidden entirely.
 * - In search mode: Only matching items are shown, without category headers.
 */
function renderMenu(menuData, isSearchMode = false) {
  const menuContainer = document.getElementById('menu-container');
  if (!menuContainer) {
    console.error('Menu container not found');
    return;
  }

  const { categories, menuItems } = menuData;

  // Clear container
  menuContainer.innerHTML = '';

  // In search mode, show only items without category headers
  if (isSearchMode) {
    const filteredItems = menuItems
      .filter(item => item.isAvailable)
      .sort((a, b) => {
        // Sort by category displayOrder first, then by item displayOrder
        const categoryA = categories.find(cat => cat.id === a.categoryId);
        const categoryB = categories.find(cat => cat.id === b.categoryId);
        if (categoryA && categoryB) {
          if (categoryA.displayOrder !== categoryB.displayOrder) {
            return categoryA.displayOrder - categoryB.displayOrder;
          }
        }
        return a.displayOrder - b.displayOrder;
      });

    // Create a container for search results
    const resultsContainer = document.createElement('div');
    resultsContainer.className = 'space-y-3';

    filteredItems.forEach(item => {
      const itemDiv = document.createElement('div');
      itemDiv.className = 'p-3 md:p-4 border border-gray-200 rounded-lg bg-white';

      // Item name
      const itemName = document.createElement('h3');
      itemName.className = 'text-base md:text-lg font-semibold text-gray-900 mb-1';
      itemName.textContent = item.name;

      // Item description
      const itemDesc = document.createElement('p');
      itemDesc.className = 'text-sm md:text-base text-gray-600 mb-2';
      itemDesc.textContent = item.description;

      // Item price
      const itemPrice = document.createElement('p');
      itemPrice.className = 'text-base md:text-lg font-bold text-gray-900';
      itemPrice.textContent = `€${item.priceEuro.toFixed(2)}`;

      itemDiv.appendChild(itemName);
      itemDiv.appendChild(itemDesc);
      itemDiv.appendChild(itemPrice);
      resultsContainer.appendChild(itemDiv);
    });

    menuContainer.appendChild(resultsContainer);
    return;
  }

  // Normal mode: show categories with collapsible headers
  // Sort categories by displayOrder
  const sortedCategories = [...categories]
    .filter(cat => cat.isActive)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  // Create a category section for each category
  sortedCategories.forEach(category => {
    // Get items for this category, sorted by displayOrder
    const categoryItems = menuItems
      .filter(item => item.categoryId === category.id && item.isAvailable)
      .sort((a, b) => a.displayOrder - b.displayOrder);

    // Skip categories with no items (filtering behavior: hide empty categories)
    if (categoryItems.length === 0) {
      return;
    }

    // Create category container
    const categoryDiv = document.createElement('div');
    categoryDiv.className = 'mb-4 border border-gray-200 rounded-lg overflow-hidden';

    // Create category header (clickable)
    const categoryHeader = document.createElement('div');
    categoryHeader.className = 'bg-gray-100 hover:bg-gray-200 cursor-pointer transition-colors p-3 md:p-4 flex justify-between items-center';
    categoryHeader.setAttribute('data-category-id', category.id);
    
    const headerContent = document.createElement('div');
    const categoryName = document.createElement('h2');
    categoryName.className = 'text-lg md:text-xl font-bold text-gray-800';
    categoryName.textContent = category.name;
    
    headerContent.appendChild(categoryName);
    
    if (category.description) {
      const categoryDesc = document.createElement('p');
      categoryDesc.className = 'text-sm md:text-base text-gray-600 mt-1';
      categoryDesc.textContent = category.description;
      headerContent.appendChild(categoryDesc);
    }

    // Add expand/collapse icon
    const icon = document.createElement('span');
    icon.className = 'text-gray-600 text-xl';
    icon.textContent = '▶';
    icon.setAttribute('data-icon', category.id);

    categoryHeader.appendChild(headerContent);
    categoryHeader.appendChild(icon);

    // Create items container (initially hidden/collapsed)
    const itemsContainer = document.createElement('div');
    itemsContainer.className = 'items-container hidden';
    itemsContainer.setAttribute('data-items', category.id);

    // Create menu items
    categoryItems.forEach(item => {
      const itemDiv = document.createElement('div');
      itemDiv.className = 'p-3 md:p-4 border-t border-gray-200';

      // Item name
      const itemName = document.createElement('h3');
      itemName.className = 'text-base md:text-lg font-semibold text-gray-900 mb-1';
      itemName.textContent = item.name;

      // Item description
      const itemDesc = document.createElement('p');
      itemDesc.className = 'text-sm md:text-base text-gray-600 mb-2';
      itemDesc.textContent = item.description;

      // Item price
      const itemPrice = document.createElement('p');
      itemPrice.className = 'text-base md:text-lg font-bold text-gray-900';
      itemPrice.textContent = `€${item.priceEuro.toFixed(2)}`;

      itemDiv.appendChild(itemName);
      itemDiv.appendChild(itemDesc);
      itemDiv.appendChild(itemPrice);
      itemsContainer.appendChild(itemDiv);
    });

    // Assemble category section
    categoryDiv.appendChild(categoryHeader);
    categoryDiv.appendChild(itemsContainer);

    // Add click handler for expand/collapse
    categoryHeader.addEventListener('click', function() {
      toggleCategory(category.id);
    });

    menuContainer.appendChild(categoryDiv);
  });
}

/**
 * Toggles the visibility of a category's items
 */
function toggleCategory(categoryId) {
  const itemsContainer = document.querySelector(`[data-items="${categoryId}"]`);
  const icon = document.querySelector(`[data-icon="${categoryId}"]`);

  if (!itemsContainer || !icon) return;

  // Toggle visibility
  if (itemsContainer.classList.contains('hidden')) {
    itemsContainer.classList.remove('hidden');
    icon.textContent = '▼';
  } else {
    itemsContainer.classList.add('hidden');
    icon.textContent = '▶';
  }
}

/**
 * Filters menu items based on search query
 * IMPORTANT: Search only matches menu items (name and description), NOT categories.
 * Categories are only shown if they contain matching items.
 * 
 * Example: Searching "chicken" will find:
 * - "Grilled Chicken Caesar Salad" (matches name)
 * - "Grilled Chicken Wrap" (matches name)
 * And will show both "Salads" and "Wraps" categories containing these items.
 * 
 * @param {string} query - The search query string
 * @returns {Object} Filtered menu data with matching items only
 */
function filterMenuData(query) {
  if (!query || query.trim() === '') {
    // Return original data if search is empty
    return originalMenuData;
  }

  const searchTerm = query.toLowerCase().trim();
  const { categories, menuItems } = originalMenuData;

  // Filter ONLY menu items that match the search query (case-insensitive)
  // Search matches if the query appears in item name OR description
  // Categories are NOT searched - they are only shown if they contain matching items
  const filteredItems = menuItems.filter(item => {
    const nameMatch = item.name.toLowerCase().includes(searchTerm);
    const descMatch = item.description.toLowerCase().includes(searchTerm);
    return nameMatch || descMatch;
  });

  // Return filtered data structure with only matching items
  // Categories array is unchanged - renderMenu will only show categories with matching items
  return {
    categories: categories,
    menuItems: filteredItems
  };
}

/**
 * Sets up the search input event listener
 */
function setupSearch() {
  const searchInput = document.getElementById('search-input');
  if (!searchInput) {
    console.error('Search input not found');
    return;
  }

  // Listen for input events (live search as user types)
  searchInput.addEventListener('input', function(e) {
    const query = e.target.value;
    
    if (!query || query.trim() === '') {
      // Show full menu with categories when search is cleared
      renderMenu(originalMenuData, false);
    } else {
      // Show only matching items without categories when searching
      const filteredData = filterMenuData(query);
      renderMenu(filteredData, true);
    }
  });
}

