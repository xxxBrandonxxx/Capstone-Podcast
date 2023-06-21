// Import React library
import React from 'react'; 
// Import ReactDOM library for client-side rendering
import ReactDOM from 'react-dom/client'; // Import ReactDOM library for client-side rendering
import { Provider } from 'react-redux'; // Import Provider component from react-redux
import store from './store/store.jsx'; // Import the Redux store
import App from './App.jsx'; // Import the main App component
import './index.css'; // Import the CSS file for styling

// Render the App component wrapped with Redux Provider and inside React.StrictMode
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}> {/* Provide the Redux store to the entire application */}
      <App /> {/* Render the main App component */}
    </Provider>
  </React.StrictMode>
);
