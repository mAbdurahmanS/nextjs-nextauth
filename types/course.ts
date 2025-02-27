export interface User {
  id: string;
  name: string;
}

export interface Lesson {
  id: string;
  title: string;
  created_at: string;
}

export interface Course {
  id: string;
  user: User;
  title: string;
  description: string;
  created_at: string;
  lessons?: Lesson[];
}

export interface ApiResponse<T> {
  status: "success" | "error";
  message: string;
  data: T;
}
