
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "hover.css/css/hover-min.css";
import { CartProvider } from './Context/CartContext';
import './index.css'
import App from './App.jsx'
createRoot(document.getElementById('root')).render(
    <CartProvider>
        <App />
    </CartProvider>
)
