export interface AuthResponse {
  user_id: number;
  user_name: string;
  remember_token: string;
}

export interface UpdatedPlantsResponse {
  timestamp: string;
  plants: Plant[];
}

export interface UpdatedTagsResponse {
  update_since: string;
  tags: Tag[];
}

export interface Tag {
  id: number;
  title: string;
  tag_id: number;
  user_id: number;
  deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface Plant {
  id: number;
  tag: number;
  is_success: boolean;
  start_time: string;
  end_time: string;
  user_id: number;
  cheating: boolean;
}