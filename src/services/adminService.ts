import axios from 'axios';

// Types for admin functionality
export interface Participant {
  id: string;
  name: string;
  role: string;
  photo?: string;
}

export interface Performance {
  id: string;
  name: string;
  date: string;
  startTime: string;
  endTime?: string;
  description: string;
  mainImage: string;
  images: string[];
  director: Participant;
  actors: Participant[];
  creativeTeam: Participant[];
}

export interface TicketPricing {
  id: string;
  performanceId: string;
  section: string;
  price: number;
}

export interface TransactionRecord {
  id: string;
  performanceId: string;
  performanceName: string;
  ticketId: string;
  section: string;
  price: number;
  date: string;
  customerName?: string;
}

export interface Employee {
  id: string;
  name: string;
  position: string;
  hourlyRate: number;
}

// Ticket section API
export interface TicketSection {
  section_id: string;
  name_en: string;
  name_ua: string;
  price: number | null;
}

// --- NEWS API ---
export interface NewsArticle {
  id: string;
  title_ua: string;
  title_en: string;
  summary_ua?: string;
  summary_en?: string;
  content_ua: string;
  content_en: string;
  date: string;
  image?: string;
}

// Mock data for admin functionalities
export const MOCK_PERFORMANCES: Performance[] = [
  {
    id: "p1",
    name: "Hamlet",
    date: "2025-05-15",
    startTime: "19:00",
    endTime: "22:00",
    description: "Shakespeare's classic tragedy about the Prince of Denmark.",
    mainImage: "https://images.unsplash.com/photo-1605722625766-a4c989c747a4?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1607998803461-4e9aef3be941?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800&h=600&fit=crop"
    ],
    director: {
      id: "d1",
      name: "John Smith",
      role: "Director"
    },
    actors: [
      {
        id: "a1",
        name: "Michael Johnson",
        role: "Hamlet"
      },
      {
        id: "a2",
        name: "Emma Davis",
        role: "Ophelia"
      }
    ],
    creativeTeam: [
      {
        id: "c1",
        name: "Sarah Wilson",
        role: "Set Designer"
      },
      {
        id: "c2",
        name: "David Thompson",
        role: "Costume Designer"
      }
    ]
  },
  {
    id: "p2",
    name: "Romeo and Juliet",
    date: "2025-06-10",
    startTime: "18:00",
    endTime: "21:00",
    description: "Shakespeare's tale of star-crossed lovers.",
    mainImage: "https://images.unsplash.com/photo-1533120753971-562b3d7e8d10?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=800&h=600&fit=crop"
    ],
    director: {
      id: "d2",
      name: "Elizabeth Brown",
      role: "Director"
    },
    actors: [
      {
        id: "a3",
        name: "Robert Anderson",
        role: "Romeo"
      },
      {
        id: "a4",
        name: "Sophia Martinez",
        role: "Juliet"
      }
    ],
    creativeTeam: [
      {
        id: "c3",
        name: "James Wilson",
        role: "Lighting Designer"
      }
    ]
  }
];

export const MOCK_TICKET_PRICING: TicketPricing[] = [
  { id: "tp1", performanceId: "all", section: "Parterre", price: 1000 },
  { id: "tp2", performanceId: "all", section: "Mezzanine", price: 800 },
  { id: "tp3", performanceId: "all", section: "1st Tier", price: 600 },
  { id: "tp4", performanceId: "all", section: "2nd Tier", price: 400 },
  { id: "tp5", performanceId: "all", section: "3rd Tier", price: 200 }
];

export const MOCK_TRANSACTIONS: TransactionRecord[] = [
  {
    id: "tr1",
    performanceId: "p1",
    performanceName: "Hamlet",
    ticketId: "t1",
    section: "Orchestra",
    price: 1500,
    date: "2025-04-20",
    customerName: "John Doe"
  },
  {
    id: "tr2",
    performanceId: "p1",
    performanceName: "Hamlet",
    ticketId: "t2",
    section: "Mezzanine",
    price: 1200,
    date: "2025-04-21",
    customerName: "Jane Smith"
  },
  {
    id: "tr3",
    performanceId: "p2",
    performanceName: "Romeo and Juliet",
    ticketId: "t3",
    section: "Balcony",
    price: 750,
    date: "2025-04-22",
    customerName: "Emily Johnson"
  }
];

export const MOCK_EMPLOYEES: Employee[] = [
  { id: "e1", name: "Alexander Clark", position: "Actor", hourlyRate: 200 },
  { id: "e2", name: "Victoria Brown", position: "Actress", hourlyRate: 200 },
  { id: "e3", name: "Daniel Harris", position: "Technician", hourlyRate: 150 },
  { id: "e4", name: "Olivia Martinez", position: "Costume Designer", hourlyRate: 180 },
  { id: "e5", name: "William Johnson", position: "Director", hourlyRate: 250 }
];

// Admin service mock functions
export const getPerformances = (): Promise<Performance[]> => {
  return Promise.resolve(MOCK_PERFORMANCES);
};

export const getPerformance = (id: string): Promise<Performance | undefined> => {
  return Promise.resolve(MOCK_PERFORMANCES.find(p => p.id === id));
};

export const addPerformance = (performance: Omit<Performance, 'id'>): Promise<Performance> => {
  const newPerformance = {
    ...performance,
    id: `p${MOCK_PERFORMANCES.length + 1}`
  };
  MOCK_PERFORMANCES.push(newPerformance);
  return Promise.resolve(newPerformance);
};

export const updatePerformance = (id: string, performance: Partial<Performance>): Promise<Performance | undefined> => {
  const index = MOCK_PERFORMANCES.findIndex(p => p.id === id);
  if (index !== -1) {
    MOCK_PERFORMANCES[index] = { ...MOCK_PERFORMANCES[index], ...performance };
    return Promise.resolve(MOCK_PERFORMANCES[index]);
  }
  return Promise.resolve(undefined);
};

export const deletePerformance = (id: string): Promise<boolean> => {
  const index = MOCK_PERFORMANCES.findIndex(p => p.id === id);
  if (index !== -1) {
    MOCK_PERFORMANCES.splice(index, 1);
    return Promise.resolve(true);
  }
  return Promise.resolve(false);
};

export const getTicketPricing = (performanceId?: string): Promise<TicketPricing[]> => {
  return Promise.resolve(MOCK_TICKET_PRICING);
};

export const updateTicketPrice = (id: string, price: number): Promise<TicketPricing | undefined> => {
  const index = MOCK_TICKET_PRICING.findIndex(tp => tp.id === id);
  if (index !== -1) {
    MOCK_TICKET_PRICING[index] = { ...MOCK_TICKET_PRICING[index], price };
    return Promise.resolve(MOCK_TICKET_PRICING[index]);
  }
  return Promise.resolve(undefined);
};

export const addTicketPricing = (pricingData: Omit<TicketPricing, "id">): Promise<TicketPricing> => {
  // Create a new pricing entry
  const newPricing: TicketPricing = {
    ...pricingData,
    id: `tp${MOCK_TICKET_PRICING.length + 1}`
  };
  
  // Check if this section already exists
  const existingIndex = MOCK_TICKET_PRICING.findIndex(
    tp => tp.section.toLowerCase() === pricingData.section.toLowerCase()
  );
  
  if (existingIndex !== -1) {
    // Update existing entry instead of adding a duplicate
    MOCK_TICKET_PRICING[existingIndex].price = pricingData.price;
    return Promise.resolve(MOCK_TICKET_PRICING[existingIndex]);
  } else {
    // Add new entry
    MOCK_TICKET_PRICING.push(newPricing);
    return Promise.resolve(newPricing);
  }
};

export const getTransactions = (startDate?: string, endDate?: string): Promise<TransactionRecord[]> => {
  if (!startDate && !endDate) {
    return Promise.resolve(MOCK_TRANSACTIONS);
  }
  
  return Promise.resolve(
    MOCK_TRANSACTIONS.filter(tr => {
      const transDate = new Date(tr.date);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      
      if (start && end) {
        return transDate >= start && transDate <= end;
      } else if (start) {
        return transDate >= start;
      } else if (end) {
        return transDate <= end;
      }
      
      return true;
    })
  );
};

export const getEmployees = async () => {
  const res = await axios.get('http://localhost:4000/api/employees');
  return res.data;
};

export const addEmployee = async (employee: Omit<Employee, 'id'>) => {
  const res = await axios.post('http://localhost:4000/api/employees', employee);
  return res.data;
};

export const updateEmployee = async (id: string, employee: Omit<Employee, 'id'>) => {
  await axios.put(`http://localhost:4000/api/employees/${id}`, employee);
};

export const deleteEmployee = async (id: string) => {
  await axios.delete(`http://localhost:4000/api/employees/${id}`);
};

export const updateEmployeeRate = (id: string, hourlyRate: number): Promise<Employee | undefined> => {
  const index = MOCK_EMPLOYEES.findIndex(e => e.id === id);
  if (index !== -1) {
    MOCK_EMPLOYEES[index] = { ...MOCK_EMPLOYEES[index], hourlyRate };
    return Promise.resolve(MOCK_EMPLOYEES[index]);
  }
  return Promise.resolve(undefined);
};

export const calculateSalary = (employeeId: string, hours: number): Promise<number> => {
  const employee = MOCK_EMPLOYEES.find(e => e.id === employeeId);
  if (employee) {
    return Promise.resolve(employee.hourlyRate * hours);
  }
  return Promise.resolve(0);
};

// --- NEWS API ---
export const getNews = async (): Promise<NewsArticle[]> => {
  const res = await axios.get('http://localhost:4000/api/news');
  return res.data;
};

export const addNewsArticle = async (article: Omit<NewsArticle, 'id'>): Promise<NewsArticle> => {
  const res = await axios.post('http://localhost:4000/api/news', article);
  return { ...article, id: res.data.id };
};

export const updateNewsArticle = async (id: string, article: Partial<NewsArticle>): Promise<void> => {
  await axios.put(`http://localhost:4000/api/news/${id}`, article);
};

export const deleteNewsArticle = async (id: string): Promise<void> => {
  await axios.delete(`http://localhost:4000/api/news/${id}`);
};

// Ticket section API
export const getTicketSections = async (): Promise<TicketSection[]> => {
  const res = await axios.get('http://localhost:4000/api/ticket-sections');
  return res.data;
};

export const updateTicketSectionPrice = async (section_id: string, price: number | null) => {
  await axios.put(`http://localhost:4000/api/ticket-sections/${section_id}`, { price });
};

export const addOrUpdateTicketSection = async (section: TicketSection) => {
  await axios.post('http://localhost:4000/api/ticket-sections', section);
};

export const updateUsername = async (oldUsername: string, newUsername: string) => {
  await axios.post('http://localhost:4000/api/update-username', { oldUsername, newUsername });
};

export const updateUserPassword = async (username: string, oldPassword: string, newPassword: string) => {
  await axios.post('http://localhost:4000/api/update-password', { username, oldPassword, newPassword });
};

export const deleteUserProfile = async (username: string) => {
  await axios.post('http://localhost:4000/api/delete-profile', { username });
};

// --- SOLD TICKETS API ---
export interface SoldTickets {
  [section_id: string]: number;
}

export const getSoldTickets = async (): Promise<SoldTickets> => {
  const res = await axios.get('http://localhost:4000/api/sold-tickets');
  const sold: SoldTickets = {};
  res.data.forEach((row: { section_id: string; sold: number }) => {
    sold[row.section_id] = row.sold;
  });
  return sold;
};

export const updateSoldTickets = async (sold: SoldTickets): Promise<void> => {
  await axios.post('http://localhost:4000/api/sold-tickets', { sold });
};

// --- LAST PROFIT API ---
export interface LastProfit {
  profits: Record<string, number>;
  total: number;
}

export const getLastProfit = async (): Promise<LastProfit> => {
  const res = await axios.get('http://localhost:4000/api/last-profit');
  const profits: Record<string, number> = {};
  res.data.profits.forEach((row: { section_id: string; profit: number }) => {
    profits[row.section_id] = row.profit;
  });
  return { profits, total: res.data.total };
};

export const updateLastProfit = async (profits: Record<string, number>, total: number): Promise<void> => {
  await axios.post('http://localhost:4000/api/last-profit', { profits, total });
};
