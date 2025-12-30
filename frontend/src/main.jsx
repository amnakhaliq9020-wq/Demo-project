import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux'
import store from './app/store.js'
import {disableReactDevTools} from '@fvilers/disable-react-devtools'

if(process.env.NODE_ENV === 'production') {
  disableReactDevTools()
}

// Add error boundary
try {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>
  )
} catch (error) {
  console.error('Error rendering app:', error);
  document.getElementById('root').innerHTML = `
    <div style="padding: 20px; font-family: Arial;">
      <h1>Error Loading App</h1>
      <p>Check browser console (F12) for details.</p>
      <p>Error: ${error.message}</p>
    </div>
  `;
}
