
import { Contest, Category, Photo, Vote } from '@/types';

// Categories
export const categories: Category[] = [
  { id: '1', name: 'Nature', description: 'Landscapes, wildlife, and natural phenomena' },
  { id: '2', name: 'Portrait', description: 'Capturing people and personalities' },
  { id: '3', name: 'Street', description: 'Urban life and city scenes' },
  { id: '4', name: 'Abstract', description: 'Non-literal interpretations and artistic compositions' },
  { id: '5', name: 'Architecture', description: 'Buildings, structures, and design elements' }
];

// Contests
const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

const nextWeek = new Date(today);
nextWeek.setDate(nextWeek.getDate() + 7);

const lastWeek = new Date(today);
lastWeek.setDate(lastWeek.getDate() - 7);

const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);

export const contests: Contest[] = [
  {
    id: '1',
    title: 'Spring Awakening',
    description: 'Capture the beauty of spring as nature comes back to life',
    category: categories[0],
    coverImageUrl: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946',
    status: 'active',
    startDate: lastWeek,
    endDate: nextWeek,
    createdBy: '1',
    createdAt: new Date('2023-03-01')
  },
  {
    id: '2',
    title: 'Urban Geometry',
    description: 'Find interesting geometric patterns in your city',
    category: categories[4],
    coverImageUrl: 'https://images.unsplash.com/photo-1518005068251-37900150dfca',
    status: 'upcoming',
    startDate: tomorrow,
    endDate: new Date(nextWeek.getTime() + 7 * 24 * 60 * 60 * 1000),
    createdBy: '1',
    createdAt: new Date('2023-03-05')
  },
  {
    id: '3',
    title: 'Faces of Humanity',
    description: 'Portrait photography that tells a story',
    category: categories[1],
    coverImageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    status: 'completed',
    startDate: new Date('2023-02-15'),
    endDate: yesterday,
    createdBy: '1',
    createdAt: new Date('2023-02-10')
  },
  {
    id: '4',
    title: 'Street Life',
    description: 'Document everyday life in the streets of your city',
    category: categories[2],
    coverImageUrl: 'https://images.unsplash.com/photo-1517732306149-e8f829eb588a',
    status: 'voting',
    startDate: new Date('2023-03-01'),
    endDate: tomorrow,
    createdBy: '1',
    createdAt: new Date('2023-02-25')
  },
  {
    id: '5',
    title: 'Creative Visions',
    description: 'Push the boundaries of abstract photography',
    category: categories[3],
    coverImageUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab',
    status: 'upcoming',
    startDate: new Date(nextWeek.getTime() + 3 * 24 * 60 * 60 * 1000),
    endDate: new Date(nextWeek.getTime() + 14 * 24 * 60 * 60 * 1000),
    createdBy: '1',
    createdAt: new Date('2023-03-10')
  }
];

// Photos
export const photos: Photo[] = [
  {
    id: '1',
    contestId: '1',
    userId: '2',
    username: 'RegularUser',
    imageUrl: 'https://images.unsplash.com/photo-1504567961542-e24d9439a724',
    caption: 'Morning dew on spring flowers',
    averageRating: 4.2,
    voteCount: 15,
    createdAt: new Date('2023-03-02'),
    moderationStatus: 'approved'
  },
  {
    id: '2',
    contestId: '1',
    userId: '3',
    username: 'PhotoEnthusiast',
    imageUrl: 'https://images.unsplash.com/photo-1462275646964-a0e3386b89fa',
    caption: 'Cherry blossoms in full bloom',
    averageRating: 4.7,
    voteCount: 12,
    createdAt: new Date('2023-03-03'),
    moderationStatus: 'approved'
  },
  {
    id: '3',
    contestId: '3',
    userId: '2',
    username: 'RegularUser',
    imageUrl: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126',
    caption: 'The intensity of a stare',
    averageRating: 4.9,
    voteCount: 24,
    createdAt: new Date('2023-02-18'),
    moderationStatus: 'approved'
  },
  {
    id: '4',
    contestId: '3',
    userId: '4',
    username: 'CreativeShooter',
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2',
    caption: 'Contemplation',
    averageRating: 4.6,
    voteCount: 18,
    createdAt: new Date('2023-02-20'),
    moderationStatus: 'approved'
  },
  {
    id: '5',
    contestId: '4',
    userId: '5',
    username: 'StreetPhotographer',
    imageUrl: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455',
    caption: 'The daily commute',
    averageRating: 4.3,
    voteCount: 9,
    createdAt: new Date('2023-03-05'),
    moderationStatus: 'approved'
  },
  {
    id: '6',
    contestId: '4',
    userId: '2',
    username: 'RegularUser',
    imageUrl: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df',
    caption: 'Urban jungle',
    averageRating: 4.5,
    voteCount: 11,
    createdAt: new Date('2023-03-06'),
    moderationStatus: 'approved'
  },
  {
    id: '7',
    contestId: '1',
    userId: '5',
    username: 'StreetPhotographer',
    imageUrl: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07',
    caption: 'New beginnings',
    averageRating: 4.4,
    voteCount: 8,
    createdAt: new Date('2023-03-04'),
    moderationStatus: 'approved'
  },
  {
    id: '8',
    contestId: '1',
    userId: '4',
    username: 'CreativeShooter',
    imageUrl: 'https://images.unsplash.com/photo-1588167789341-b5e36bad1c15',
    caption: 'Spring colors palette',
    averageRating: 4.0,
    voteCount: 6,
    createdAt: new Date('2023-03-05'),
    moderationStatus: 'approved'
  },
  {
    id: '9',
    contestId: '3',
    userId: '5',
    username: 'StreetPhotographer',
    imageUrl: 'https://images.unsplash.com/photo-1504257432389-52343af06ae3',
    caption: 'Character study',
    averageRating: 4.8,
    voteCount: 20,
    createdAt: new Date('2023-02-19'),
    moderationStatus: 'approved'
  },
  {
    id: '10',
    contestId: '4',
    userId: '3',
    username: 'PhotoEnthusiast',
    imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9',
    caption: 'Streets of New York',
    averageRating: 4.6,
    voteCount: 14,
    createdAt: new Date('2023-03-07'),
    moderationStatus: 'approved'
  }
];

// Votes (mock data)
export const votes: Vote[] = [
  // Generate some mock votes
  ...[...Array(50)].map((_, i) => ({
    userId: `${(i % 5) + 1}`,
    photoId: `${(i % 10) + 1}`,
    rating: Math.floor(Math.random() * 5) + 1,
    createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
  }))
];
