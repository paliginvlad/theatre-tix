import React, { createContext, useState, useContext, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";

// Define our user type
export interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  photoURL?: string;
  isAdmin?: boolean; // New field to track admin status
}

// Mock data for our users
const MOCK_USERS: User[] = [
  {
    id: '1',
    username: 'john_doe',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    photoURL: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=250&h=250&fit=crop&auto=format&q=80'
  },
  {
    id: 'admin',
    username: 'admin',
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@theatretix.com',
    isAdmin: true
  }
];

// Mock purchased tickets data
export interface Ticket {
  id: string;
  performanceId: string;
  performanceName: string;
  date: string;
  time: string;
  seat: string;
  price: number;
  level: string;
}

const MOCK_TICKETS: Record<string, Ticket[]> = {
  '1': [
    {
      id: 't1',
      performanceId: 'p1',
      performanceName: 'Hamlet',
      date: '2025-05-15',
      time: '19:00',
      seat: 'Parterre A12',
      price: 1000,
      level: 'Parterre'
    }
  ]
};

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean; // New field to expose admin status
  userTickets: Ticket[];
  register: (username: string, password: string, firstName: string, lastName: string, email: string) => Promise<void>;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  updateUserProfile: (user: Partial<User>) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userTickets, setUserTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Computed property for admin status
  const isAdmin = !!currentUser?.isAdmin;

  useEffect(() => {
    // Check localStorage for existing user session
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setCurrentUser(parsedUser);
        
        // Set mock tickets for the user
        if (MOCK_TICKETS[parsedUser.id]) {
          setUserTickets(MOCK_TICKETS[parsedUser.id]);
        }
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('currentUser');
      }
    }
    setLoading(false);
  }, []);

  const register = async (username: string, password: string, firstName: string, lastName: string, email: string): Promise<void> => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:4000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, firstName, lastName, email })
      });
      const data = await response.json();
      setLoading(false);
      if (!response.ok) {
        toast({
          title: "Registration Failed",
          description: data.error || "Registration error",
          variant: "destructive",
        });
        throw new Error(data.error || 'Registration error');
      }
      // После успешной регистрации сразу логиним пользователя (минимальный профиль)
      setCurrentUser({
        id: username,
        username,
        firstName,
        lastName,
        email,
        isAdmin: false
      });
      localStorage.setItem('currentUser', JSON.stringify({
        id: username,
        username,
        firstName,
        lastName,
        email,
        isAdmin: false
      }));
      setUserTickets([]);
      toast({
        title: "Registration Successful",
        description: `Welcome, ${firstName}!`,
      });
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const login = async (username: string, password: string): Promise<void> => {
    setLoading(true);
    // Новый вариант: делаем запрос к backend вместо mock-логики
    try {
      const response = await fetch('http://localhost:4000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();
      setLoading(false);
      if (!response.ok) {
        toast({
          title: "Login Failed",
          description: data.error || "Invalid username or password",
          variant: "destructive",
        });
        throw new Error(data.error || 'Invalid username or password');
      }
      // Сохраняем роль и пользователя
      setCurrentUser({
        id: username,
        username,
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        email: data.email || '',
        isAdmin: data.role === 'admin'
      });
      localStorage.setItem('currentUser', JSON.stringify({
        id: username,
        username,
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        email: data.email || '',
        isAdmin: data.role === 'admin'
      }));
      setUserTickets([]);
      toast({
        title: data.role === 'admin' ? "Admin Login Successful" : "Login Successful",
        description: `Welcome back, ${username}!`,
      });
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setUserTickets([]);
    localStorage.removeItem('currentUser');
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully",
    });
  };

  const updateUserProfile = async (updatedUserData: Partial<User>) => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const response = await fetch('http://localhost:4000/api/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: currentUser.username,
          firstName: updatedUserData.firstName,
          lastName: updatedUserData.lastName,
          email: updatedUserData.email
        })
      });
      const data = await response.json();
      setLoading(false);
      if (!response.ok) {
        toast({
          title: "Profile Update Failed",
          description: data.error || "Failed to update profile",
          variant: "destructive",
        });
        return;
      }
      const updatedUser = { ...currentUser, ...updatedUserData };
      setCurrentUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully",
      });
    } catch (error) {
      setLoading(false);
      toast({
        title: "Profile Update Failed",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        currentUser, 
        isAuthenticated: !!currentUser,
        isAdmin,
        userTickets, 
        register, 
        login, 
        logout, 
        updateUserProfile,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
