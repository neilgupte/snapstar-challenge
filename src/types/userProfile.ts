
export interface UserProfileData {
  id: string;
  username: string;
  avatarUrl: string;
  points: number;
  wins: number;
  highlightedAchievement?: string;
  bio?: string;
  contestsEntered: number;
}
