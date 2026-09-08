export interface RobloxUser {
  id: number;
  displayName: string;
  name: string;
  avatarUrl: string;
  loading: boolean;
  error?: boolean;
}

export interface GroupData {
  name: string;
  memberCount: number;
  totalVisits: string;
  iconUrl: string;
}
