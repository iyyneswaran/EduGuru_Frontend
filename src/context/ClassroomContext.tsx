import React, { createContext, useContext, useState, useCallback } from 'react';
import * as api from '../services/api';

interface Classroom {
    id: string;
    name: string;
    subject: string;
    description: string;
    code: string;
    teacherId: string;
    teacher?: { id: string; name: string };
    _count?: { members: number; modules: number; quizzes: number; materials: number };
}

interface ClassroomContextType {
    classrooms: Classroom[];
    currentClassroom: Classroom | null;
    isLoading: boolean;
    fetchClassrooms: () => Promise<void>;
    setCurrentClassroom: (classroom: Classroom | null) => void;
    joinClassroom: (code: string) => Promise<Classroom>;
    createClassroom: (data: { name: string; subject: string; description?: string }) => Promise<Classroom>;
}

const ClassroomContext = createContext<ClassroomContextType | null>(null);

export function ClassroomProvider({ children }: { children: React.ReactNode }) {
    const [classrooms, setClassrooms] = useState<Classroom[]>([]);
    const [currentClassroom, setCurrentClassroom] = useState<Classroom | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const fetchClassrooms = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await api.getClassrooms();
            setClassrooms(res.data || []);
        } catch (err) {
            console.error('Failed to fetch classrooms:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const joinClassroomByCode = useCallback(async (code: string) => {
        const res = await api.joinClassroom(code);
        await fetchClassrooms();
        return res.data;
    }, [fetchClassrooms]);

    const createNewClassroom = useCallback(async (data: { name: string; subject: string; description?: string }) => {
        const res = await api.createClassroom(data);
        await fetchClassrooms();
        return res.data;
    }, [fetchClassrooms]);

    return (
        <ClassroomContext.Provider
            value={{
                classrooms,
                currentClassroom,
                isLoading,
                fetchClassrooms,
                setCurrentClassroom,
                joinClassroom: joinClassroomByCode,
                createClassroom: createNewClassroom,
            }}
        >
            {children}
        </ClassroomContext.Provider>
    );
}

export function useClassroom() {
    const context = useContext(ClassroomContext);
    if (!context) {
        throw new Error('useClassroom must be used within a ClassroomProvider');
    }
    return context;
}
