export interface Lesson {
  id: string;
  course: {
    id: string;
    title: string;
  };
  title: string;
  content?: string;
  created_at: string;
}

export interface ApiResponse<T> {
  status: "success" | "error";
  message: string;
  data: T;
}
