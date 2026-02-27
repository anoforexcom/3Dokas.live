import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { db, analytics } from '../lib/firebase';
import { collection, addDoc, query, orderBy, onSnapshot } from "firebase/firestore";
import { logEvent } from "firebase/analytics";

export interface Order {
    id: string;
    userId: string;
    userName: string;
    description: string;
    amount: number;
    date: string; // ISO string
    status: 'completed' | 'pending' | 'failed';
    packId?: string;
}

interface SalesContextType {
    orders: Order[];
    addOrder: (order: Order) => void;
    getOrdersByUser: (userId: string) => Order[];
    getTotalRevenue: () => number;
    getMonthlyRevenue: () => number[]; // Returns array of 12 months for current year
}

const SalesContext = createContext<SalesContextType | undefined>(undefined);

export const SalesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [orders, setOrders] = useState<Order[]>([]);

    // Load from Firestore
    useEffect(() => {
        const q = query(collection(db, "orders"), orderBy("date", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const loadedOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
            setOrders(loadedOrders);
        });

        return () => unsubscribe();
    }, []);

    const addOrder = async (order: Order) => {
        try {
            await addDoc(collection(db, "orders"), order);

            // Log Purchase Event to Firebase Analytics
            logEvent(analytics, 'purchase', {
                transaction_id: order.id,
                value: order.amount,
                currency: 'EUR',
                items: [{
                    item_id: order.packId || 'custom_credits',
                    item_name: order.description,
                    price: order.amount
                }]
            });
        } catch (e) {
            console.error("Error adding order: ", e);
        }
    };

    const getOrdersByUser = (userId: string) => {
        return orders.filter(o => o.userId === userId);
    };

    const getTotalRevenue = () => {
        return orders.reduce((sum, order) => sum + (order.status === 'completed' ? order.amount : 0), 0);
    };

    const getMonthlyRevenue = () => {
        const revenue = new Array(12).fill(0);
        const currentYear = new Date().getFullYear();

        orders.forEach(order => {
            const date = new Date(order.date);
            if (order.status === 'completed' && date.getFullYear() === currentYear) {
                revenue[date.getMonth()] += order.amount;
            }
        });

        return revenue;
    };

    return (
        <SalesContext.Provider value={{
            orders,
            addOrder,
            getOrdersByUser,
            getTotalRevenue,
            getMonthlyRevenue
        }}>
            {children}
        </SalesContext.Provider>
    );
};

export const useSales = () => {
    const context = useContext(SalesContext);
    if (context === undefined) {
        throw new Error('useSales must be used within a SalesProvider');
    }
    return context;
};
