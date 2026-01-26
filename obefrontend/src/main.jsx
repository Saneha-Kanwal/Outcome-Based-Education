/**
 * Main Entry Point for OBE System Frontend Application
 * 
 * This is the first file that runs when the React application loads.
 * It initializes React, finds the root HTML element, and renders the App component.
 * 
 * What this file does:
 * 1. Imports React and necessary modules
 * 2. Finds the root HTML element (usually <div id="root"></div> in index.html)
 * 3. Renders the App component into that root element
 * 4. Handles any errors that occur during rendering
 * 
 * File: src/main.jsx
 * Author: OBE System Development Team
 */

// Import StrictMode from React
// StrictMode is a wrapper component that helps identify potential problems in the app
// It performs additional checks and warnings in development mode
// It doesn't render any visible UI, just helps with debugging
import { StrictMode } from 'react';

// Import createRoot from react-dom/client
// createRoot is the modern way to render React apps (React 18+)
// The old way was ReactDOM.render(), but createRoot is better for concurrent features
// This function creates a root for the React application
import { createRoot } from 'react-dom/client';

// Import global CSS styles
// index.css contains base styles that apply to the entire application
// Things like: body styles, global resets, base font settings, etc.
import './index.css';

// Import the main App component
// App.jsx is the root component that contains all other components
// It sets up routing, context providers, and the overall application structure
import App from './App.jsx';

// ============================================================================
// FIND ROOT ELEMENT
// ============================================================================

// Find the root HTML element where React will render the app
// This element is defined in index.html: <div id="root"></div>
// getElementById returns the element with id="root" or null if not found
const rootElement = document.getElementById('root');

// Check if the root element exists
// This is a safety check - if the root element is missing, we can't render the app
if (!rootElement) {
  // Throw an error if root element is not found
  // This error will appear in the browser console
  // It helps developers understand why the app isn't loading
  throw new Error('Root element not found');
}

// ============================================================================
// RENDER APPLICATION
// ============================================================================

// Wrap everything in try-catch to handle any errors during rendering
// This prevents the entire page from crashing if something goes wrong
try {
  // Create a root using createRoot() function
  // This is the modern React 18 way of rendering
  // The root manages the entire React tree
  createRoot(rootElement).render(
    // Wrap App in StrictMode for better development experience
    // StrictMode enables additional checks and warnings:
    // - Detects components with unsafe lifecycles
    // - Warns about legacy string ref API usage
    // - Warns about deprecated findDOMNode usage
    // - Detects unexpected side effects
    // Note: StrictMode only runs in development, not in production builds
    <StrictMode>
      {/* Render the main App component */}
      {/* App component contains all routes, context providers, and UI */}
      <App />
    </StrictMode>
  );
} catch (error) {
  // If an error occurs during rendering, catch it here
  // This prevents the entire page from showing a blank screen
  
  // Log the error to the browser console
  // This helps developers debug the issue
  console.error('Error rendering app:', error);
  
  // Display a user-friendly error message on the page
  // Instead of a blank screen, users see a helpful error message
  rootElement.innerHTML = `
    <div style="padding: 20px; font-family: Arial, sans-serif;">
      <h1>Application Error</h1>
      <p>There was an error loading the application.</p>
      <p>Error: ${error.message}</p>
      <p>Please check the browser console for more details.</p>
    </div>
  `;
  
  // Note: innerHTML is used here as a fallback because React rendering failed
  // In normal operation, React manages the DOM, but here we need direct DOM manipulation
}

// ============================================================================
// NOTES
// ============================================================================
// 
// This file is very simple but crucial:
// - It's the entry point that starts the entire React application
// - It must successfully find the root element and render the App component
// - Error handling ensures users see a message instead of a blank page
// 
// After this file runs:
// - React takes over and manages the entire UI
// - All future updates happen through React's virtual DOM
// - The App component handles routing, authentication, and all other features
