
import { Contest, Photo, Vote } from '@/types';
import { contests, photos, votes } from './mockData';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getActiveContests = async (): Promise<Contest[]> => {
  await delay(500); // Simulate API delay
  
  return contests.filter(contest => 
    contest.status === 'active' || contest.status === 'voting'
  ).sort((a, b) => a.endDate.getTime() - b.endDate.getTime());
};

export const getUpcomingContests = async (): Promise<Contest[]> => {
  await delay(300); // Simulate API delay
  
  return contests.filter(contest => 
    contest.status === 'upcoming'
  ).sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
};

export const getCompletedContests = async (): Promise<Contest[]> => {
  await delay(300); // Simulate API delay
  
  return contests.filter(contest => 
    contest.status === 'completed'
  ).sort((a, b) => b.endDate.getTime() - a.endDate.getTime());
};

export const getContestById = async (id: string): Promise<Contest | null> => {
  await delay(200); // Simulate API delay
  
  return contests.find(contest => contest.id === id) || null;
};

export const getPhotosByContestId = async (contestId: string): Promise<Photo[]> => {
  await delay(500); // Simulate API delay
  
  return photos
    .filter(photo => photo.contestId === contestId && photo.moderationStatus === 'approved')
    .sort((a, b) => b.averageRating - a.averageRating);
};

export const getPhotoById = async (id: string): Promise<Photo | null> => {
  await delay(200); // Simulate API delay
  
  return photos.find(photo => photo.id === id) || null;
};

export const submitPhoto = async (
  contestId: string,
  userId: string,
  username: string,
  imageUrl: string,
  caption?: string
): Promise<Photo> => {
  await delay(1000); // Simulate API delay
  
  // Check if user already submitted to this contest
  const existingSubmission = photos.find(
    photo => photo.contestId === contestId && photo.userId === userId
  );
  
  if (existingSubmission) {
    // If updating an existing submission
    existingSubmission.imageUrl = imageUrl;
    if (caption !== undefined) {
      existingSubmission.caption = caption;
    }
    return existingSubmission;
  }
  
  // In a real app, we would also validate the contest is open for submissions
  const contest = contests.find(c => c.id === contestId);
  if (!contest || contest.status !== 'active') {
    throw new Error('This contest is not open for submissions');
  }
  
  // Run mock "AI moderation" (all photos are approved in this mock)
  // In a real app, this would call an external API
  
  // Create new photo
  const newPhoto: Photo = {
    id: `${photos.length + 1}`,
    contestId,
    userId,
    username,
    imageUrl,
    caption,
    averageRating: 0,
    voteCount: 0,
    createdAt: new Date(),
    moderationStatus: 'approved', // Auto-approve for demo
  };
  
  photos.push(newPhoto);
  
  return newPhoto;
};

export const deletePhoto = async (photoId: string, userId: string): Promise<void> => {
  await delay(800); // Simulate API delay
  
  // Find the photo
  const photoIndex = photos.findIndex(photo => photo.id === photoId && photo.userId === userId);
  
  if (photoIndex === -1) {
    throw new Error('Photo not found or you do not have permission to delete it');
  }
  
  // Find the contest
  const photo = photos[photoIndex];
  const contest = contests.find(c => c.id === photo.contestId);
  
  if (!contest || contest.status !== 'active') {
    throw new Error('You can only delete photos from active contests');
  }
  
  // Remove the photo
  photos.splice(photoIndex, 1);
  
  // Remove any votes for this photo
  const voteIndices = votes.reduce((indices, vote, index) => {
    if (vote.photoId === photoId) {
      indices.push(index);
    }
    return indices;
  }, [] as number[]);
  
  // Remove votes in reverse order to not affect indices
  for (let i = voteIndices.length - 1; i >= 0; i--) {
    votes.splice(voteIndices[i], 1);
  }
};

export const voteOnPhoto = async (
  photoId: string,
  userId: string,
  rating: number
): Promise<void> => {
  await delay(300); // Simulate API delay
  
  // Check if photo exists
  const photo = photos.find(p => p.id === photoId);
  if (!photo) {
    throw new Error('Photo not found');
  }
  
  // Check if user already voted on this photo
  const existingVote = votes.find(
    vote => vote.photoId === photoId && vote.userId === userId
  );
  
  if (existingVote) {
    throw new Error('You have already voted on this photo');
  }
  
  // Validate rating
  if (rating < 1 || rating > 5) {
    throw new Error('Rating must be between 1 and 5');
  }
  
  // Add vote
  const newVote: Vote = {
    userId,
    photoId,
    rating,
    createdAt: new Date()
  };
  
  votes.push(newVote);
  
  // Update photo's average rating
  const photoVotes = votes.filter(vote => vote.photoId === photoId);
  const totalRating = photoVotes.reduce((sum, vote) => sum + vote.rating, 0);
  photo.averageRating = Number((totalRating / photoVotes.length).toFixed(1));
  photo.voteCount = photoVotes.length;
};

export const getUserVote = async (photoId: string, userId: string): Promise<number | null> => {
  await delay(100); // Simulate API delay
  
  const vote = votes.find(v => v.photoId === photoId && v.userId === userId);
  return vote ? vote.rating : null;
};

export const getUserSubmissionCount = async (userId: string): Promise<number> => {
  await delay(100); // Simulate API delay
  
  // Get photos submitted by the user in the last 7 days
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  
  return photos.filter(
    photo => photo.userId === userId && photo.createdAt > oneWeekAgo
  ).length;
};

export const hasUserSubmittedToContest = async (userId: string, contestId: string): Promise<boolean> => {
  await delay(100); // Simulate API delay
  
  return photos.some(photo => photo.userId === userId && photo.contestId === contestId);
};
