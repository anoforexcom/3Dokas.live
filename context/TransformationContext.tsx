import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { db, analytics } from '../lib/firebase';
import { collection, addDoc, query, orderBy, onSnapshot, where, getDocs, updateDoc } from "firebase/firestore";
import { logEvent } from "firebase/analytics";

export interface Transformation {
    id: string;
    userId: string; // To filter for specific user vs public gallery
    name: string;
    prompt: string;
    imageUrl: string; // The input image
    modelUrl: string | null; // The output model
    status: 'processing' | 'completed' | 'failed' | 'draft';
    date: string;
    authorName?: string; // For gallery display
}

interface TransformationContextType {
    transformations: Transformation[];
    addTransformation: (transformation: Transformation) => void;
    updateTransformationStatus: (id: string, status: Transformation['status'], modelUrl?: string) => void;
    getTransformationsByUser: (userId: string) => Transformation[];
}

const TransformationContext = createContext<TransformationContextType | undefined>(undefined);

export const TransformationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [transformations, setTransformations] = useState<Transformation[]>([]);

    // Load from Firestore
    useEffect(() => {
        const q = query(collection(db, "transformations"), orderBy("date", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Transformation));
            setTransformations(items);
        });
        return () => unsubscribe();
    }, []);

    const addTransformation = async (transformation: Transformation) => {
        try {
            await addDoc(collection(db, "transformations"), transformation);

            // Log Generation Event
            logEvent(analytics, 'generate_lead', {
                currency: 'EUR',
                value: 1, // Represents 1 credit/generation
                item_name: transformation.prompt
            });
        } catch (e) {
            console.error("Error adding transformation: ", e);
        }
    };

    const updateTransformationStatus = async (id: string, status: Transformation['status'], modelUrl?: string) => {
        // Since we are using Firestore generated IDs or custom IDs, we need to be careful.
        // For simplicity, if we used addDoc, the ID in the context state is the Firestore Doc ID.
        // However, in our previous code we generated random IDs. 
        // We will assume for now we are querying by the ID field if it's not the document ID, but let's try to update the document directly.

        // Find the document with this ID (if we used custom IDs) or assume it matches.
        // The implementation below assumes the 'id' passed here IS the firestore document ID.
        // If we are migrating from localStorage logic where we generated random IDs, we might have a mismatch if we don't store the firestore doc ID.

        // BETTER APPROACH: Query for the doc where 'id' field matches, then update.
        // This is safer if we kept our own ID logic.

        /* 
           NOTE: In a real app we should use the Firestore Document ID as the primary key.
           For this migration, the addTransformation logic above uses addDoc which generates a new ID.
           But the object passed to it HAS an 'id' field manually generated in Editor.tsx.
           So we have two IDs. The easiest fix is to query by the field 'id'.
        */

        try {
            const q = query(collection(db, "transformations"), where("id", "==", id));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach(async (doc) => {
                await updateDoc(doc.ref, {
                    status,
                    ...(modelUrl ? { modelUrl } : {})
                });
            });
        } catch (e) {
            console.error("Error updating transformation: ", e);
        }
    };

    const getTransformationsByUser = (userId: string) => {
        return transformations.filter(t => t.userId === userId);
    };

    return (
        <TransformationContext.Provider value={{
            transformations,
            addTransformation,
            updateTransformationStatus,
            getTransformationsByUser
        }}>
            {children}
        </TransformationContext.Provider>
    );
};

export const useTransformations = () => {
    const context = useContext(TransformationContext);
    if (context === undefined) {
        throw new Error('useTransformations must be used within a TransformationProvider');
    }
    return context;
};
