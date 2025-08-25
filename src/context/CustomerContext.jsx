import {createContext, useState} from "react";

const initialState = {
    customerName: "",
    mobileNumber: "",
    gender: "",
    services: [],
    employeeName: "",
    paymentMethod: {cash: null, online: null, type: "cash"}
};

export const CustomerContext = createContext({
        customerData: initialState,
        updateCustomerData: () => {
        },
        resetCustomerData: () => {
        }
    }
);

export const CustomerProvider = ({children}) => {
    const [customerData, setCustomerData] = useState(initialState);

    const updateCustomerData = (key, value) => {
        setCustomerData((previousData) => ({...previousData, [key]: value}));
    };

    const resetCustomerData = () => {
        setCustomerData(initialState)
    };

    const value = {
        customerData, updateCustomerData, resetCustomerData
    };

    return (
        <CustomerContext.Provider value={value}>{children}</CustomerContext.Provider>
    );
};