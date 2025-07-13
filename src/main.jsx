import React from 'react'
import ReactDOM from 'react-dom/client';
import './index.css'
import App from './App.jsx'
import {createBrowserRouter, Navigate, RouterProvider} from "react-router-dom";
import Customer from "./Customer_Information/Customer";
import Dashboard from "./pages/DashBoard";
import Reports from "./pages/Reports";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        children: [
            {
                index: true,
                element: <Navigate to="/customer-details"/>
            },
            {
                path: "/customer-details",
                element: <Customer/>,
            },
            {
                path: "/dashboard",
                element: <Dashboard/>,
            },
            {
                path: '/reports',
                element: <Reports/>
            }
        ]
    }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <RouterProvider router={router}/>
    </React.StrictMode>,
)
