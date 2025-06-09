export interface Item {
  id: number;
  name: string;
  description?: string;
  createdAt: string; // Assuming string representation for simplicity across boundaries
  updatedAt: string; // Assuming string representation
}

export interface CreateItemPayload {
  name: string;
  description?: string;
}

export interface UpdateItemPayload {
  name?: string;
  description?: string;
}
