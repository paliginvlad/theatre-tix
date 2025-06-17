// Types for our performances
export interface Performance {
  id: string;
  name: string;
  date: string;
  startTime: string;
  endTime: string;
  description: string;
  director: string;
  actors: string[];
  images: string[];
  mainImage: string;
  price: {
    parterre: number;
    mezzanine: number;
    firstTier: number;
    secondTier: number;
    thirdTier: number;
  };
  ratings: number[];
  comments: Comment[];
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  rating: number;
  date: string;
}

// Mock data
const performances: Performance[] = [
  {
    id: "p1",
    name: "Hamlet",
    date: "2025-05-15",
    startTime: "19:00",
    endTime: "22:00",
    description: "The Tragedy of Hamlet, Prince of Denmark, is a tragedy written by William Shakespeare between 1599 and 1602. Set in Denmark, the play depicts Prince Hamlet and his revenge against his uncle, Claudius, who has murdered Hamlet's father in order to seize his throne and marry Hamlet's mother.",
    director: "Sarah Johnson",
    actors: ["Michael Stone", "Emma Williams", "Daniel Brown", "Sophia Lee"],
    images: [
      "/site_photos/hamlet_1.png",
      "/site_photos/hamlet_2.png",
      "/site_photos/hamlet_3.png"
    ],
    mainImage: "/site_photos/hamlet_main.png",
    price: {
      parterre: 1000,
      mezzanine: 800,
      firstTier: 600,
      secondTier: 400,
      thirdTier: 200
    },
    ratings: [5, 4, 5, 4, 5],
    comments: [
      {
        id: "c1",
        userId: "1",
        userName: "John Doe",
        text: "Amazing performance! The lead actor was phenomenal.",
        rating: 5,
        date: "2025-05-01"
      }
    ]
  },
  {
    id: "p2",
    name: "Romeo and Juliet",
    date: "2025-05-20",
    startTime: "20:00",
    endTime: "22:30",
    description: "Romeo and Juliet is a tragedy written by William Shakespeare early in his career about two young Italian star-crossed lovers whose deaths ultimately reconcile their feuding families.",
    director: "Robert Wilson",
    actors: ["James Parker", "Olivia Smith", "Thomas Miller", "Isabella Johnson"],
    images: [
      "/site_photos/romeo_and_juliet_1.png",
      "/site_photos/romeo_and_juliet_2.png",
      "/site_photos/romeo_and_juliet_3.png"
    ],
    mainImage: "/site_photos/romeo_and_juliet_main.png",
    price: {
      parterre: 1000,
      mezzanine: 800,
      firstTier: 600,
      secondTier: 400,
      thirdTier: 200
    },
    ratings: [4, 5, 5, 4, 5],
    comments: [
      {
        id: "c2",
        userId: "1",
        userName: "John Doe",
        text: "Beautiful interpretation of the classic play. The costumes were stunning!",
        rating: 4,
        date: "2025-05-05"
      }
    ]
  },
  {
    id: "p3",
    name: "Macbeth",
    date: "2025-05-25",
    startTime: "19:30",
    endTime: "22:15",
    description: "Macbeth is a tragedy by William Shakespeare; it is thought to have been first performed in 1606. It dramatizes the damaging physical and psychological effects of political ambition on those who seek power for its own sake.",
    director: "David Thompson",
    actors: ["William Clark", "Charlotte White", "Henry Davis", "Grace Taylor"],
    images: [
      "/site_photos/Macbeth_1.png",
      "/site_photos/Macbeth_2.png",
      "/site_photos/Macbeth_3.png"
    ],
    mainImage: "/site_photos/Macbeth_main.png",
    price: {
      parterre: 1000,
      mezzanine: 800,
      firstTier: 600,
      secondTier: 400,
      thirdTier: 200
    },
    ratings: [5, 4, 4, 5, 3],
    comments: [
      {
        id: "c3",
        userId: "1",
        userName: "John Doe",
        text: "The atmosphere was incredible. I felt transported to medieval Scotland.",
        rating: 5,
        date: "2025-05-10"
      }
    ]
  },
  {
    id: "p4",
    name: "The Tempest",
    date: "2025-06-05",
    startTime: "18:45",
    endTime: "21:30",
    description: "The Tempest is a play by William Shakespeare, probably written in 1610–1611, and thought to be one of the last plays that Shakespeare wrote alone. After the first scene, which takes place on a ship at sea during a tempest, the rest of the story is set on a remote island where the sorcerer Prospero, a complex and contradictory character, lives with his daughter Miranda, and his two servants—Caliban, a savage monster figure, and Ariel, an airy spirit.",
    director: "Elizabeth Roberts",
    actors: ["Richard Morgan", "Jennifer Adams", "Matthew Wilson", "Emily Harris"],
    images: [
      "/site_photos/the_tempest_1.png",
      "/site_photos/the_tempest_2.png",
      "/site_photos/the_tempest_3.png"
    ],
    mainImage: "/site_photos/the_tempest_main.png",
    price: {
      parterre: 1000,
      mezzanine: 800,
      firstTier: 600,
      secondTier: 400,
      thirdTier: 200
    },
    ratings: [4, 5, 5, 3, 4],
    comments: [
      {
        id: "c4",
        userId: "1",
        userName: "John Doe",
        text: "The special effects were magical. Great performance by the entire cast.",
        rating: 4,
        date: "2025-05-15"
      }
    ]
  },
  {
    id: "p5",
    name: "A Midsummer Night's Dream",
    date: "2025-06-15",
    startTime: "20:15",
    endTime: "22:45",
    description: "A Midsummer Night's Dream is a comedy written by William Shakespeare in 1595/96. It portrays the events surrounding the marriage of Theseus, the Duke of Athens, to Hippolyta, the former queen of the Amazons.",
    director: "Andrew Peterson",
    actors: ["Samuel Green", "Natalie Turner", "Christopher Lewis", "Victoria Moore"],
    images: [
      "/site_photos/a_midsummer_nights_dream_1.png",
      "/site_photos/a_midsummer_nights_dream_2.png",
      "/site_photos/a_midsummer_nights_dream_3.png"
    ],
    mainImage: "/site_photos/a_midsummer_nights_dream_main.png",
    price: {
      parterre: 1000,
      mezzanine: 800,
      firstTier: 600,
      secondTier: 400,
      thirdTier: 200
    },
    ratings: [5, 4, 5, 5, 4],
    comments: [
      {
        id: "c5",
        userId: "1",
        userName: "John Doe",
        text: "Hilarious and enchanting! The fairy scenes were particularly delightful.",
        rating: 5,
        date: "2025-05-20"
      }
    ]
  }
];

// Генерируем расписание: в каждый чётный день только один спектакль по очереди
const scheduleDays = 90; // 3 месяца
const today = new Date();
const generatedPerformances: Performance[] = [];
let perfIndex = 0;
for (let i = 0; i < scheduleDays; i++) {
  const date = new Date(today);
  date.setDate(date.getDate() + i);
  if (date.getDate() % 2 === 0) { // чётный день месяца
    const basePerformance = performances[perfIndex % performances.length];
    const newPerformance: Performance = {
      ...JSON.parse(JSON.stringify(basePerformance)),
      id: `generated_${basePerformance.id}_${i}`,
      date: date.toISOString().split('T')[0],
      comments: []
    };
    generatedPerformances.push(newPerformance);
    perfIndex++;
  }
}

const allPerformances = [...performances, ...generatedPerformances];

// Service functions
export const getAllPerformances = (): Performance[] => {
  return allPerformances;
};

export const getPerformanceById = (id: string): Performance | undefined => {
  return allPerformances.find(performance => performance.id === id);
};

export const getUpcomingPerformances = (): Performance[] => {
  const today = new Date();
  return allPerformances
    .filter(performance => new Date(performance.date) >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 10); // Only get the next 10 performances
};

export const getFuturePerformances = (): Performance[] => {
  const today = new Date();
  return allPerformances
    .filter(performance => new Date(performance.date) >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

// --- COMMENTS API ---
import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:4000';

export const fetchComments = async (performanceId: string) => {
  const res = await axios.get(`/api/comments/${performanceId}`);
  return res.data;
};

export const postComment = async (comment: {
  performance_id: string;
  user_id: string;
  user_name: string;
  text: string;
  rating: number;
  date: string;
}) => {
  const res = await axios.post('/api/comments', comment);
  return res.data;
};

export const updateComment = async (id: number, data: { text: string; rating: number }) => {
  const res = await axios.put(`/api/comments/${id}`, data);
  return res.data;
};

export const deleteComment = async (id: number) => {
  const res = await axios.delete(`/api/comments/${id}`);
  return res.data;
};

// Add a comment and rating to a performance
export const addCommentToPerformance = (
  performanceId: string,
  userId: string,
  userName: string,
  text: string,
  rating: number
): Comment | null => {
  const performance = allPerformances.find(p => p.id === performanceId);
  
  if (!performance) return null;
  
  const newComment: Comment = {
    id: `c${performance.comments.length + 1}_${Date.now()}`,
    userId,
    userName,
    text,
    rating,
    date: new Date().toISOString().split('T')[0]
  };
  
  performance.comments.push(newComment);
  performance.ratings.push(rating);
  
  return newComment;
};

// Helper function to get average rating
export const getAverageRating = (performance: Performance): number => {
  if (performance.ratings.length === 0) return 0;
  const sum = performance.ratings.reduce((a, b) => a + b, 0);
  return Math.round((sum / performance.ratings.length) * 10) / 10;
};
