
export interface Contest {
  id: string;
  title: string;
  description: string;
  category: Category;
  coverImageUrl: string;
  status: 'draft' | 'upcoming' | 'active' | 'voting' | 'completed';
  startDate: Date;
  endDate: Date;
  createdBy: string;
  createdAt: Date;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface Photo {
  id: string;
  contestId: string;
  userId: string;
  username: string;
  imageUrl: string;
  caption?: string;
  averageRating: number;
  voteCount: number;
  createdAt: Date;
  moderationStatus: 'pending' | 'approved' | 'rejected';
  moderationNotes?: string;
}

export interface Vote {
  userId: string;
  photoId: string;
  rating: number;
  createdAt: Date;
}

export interface UserProfile {
  id: string;
  username: string;
  bio?: string;
  avatarUrl?: string;
  followersCount: number;
  followingCount: number;
  photosCount: number;
  winCount: number;
}
