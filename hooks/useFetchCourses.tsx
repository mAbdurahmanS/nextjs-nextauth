import useSWR from "swr";
import { ApiResponse, Course } from "@/types/course";
import { useSession } from "next-auth/react";

const fetcher = async (url: string, token: string | null): Promise<Course[]> => {
    if (!token) {
        throw new Error("No authentication token available");
    }

    const response = await fetch(url, {
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Failed to fetch courses");
    }

    const data: ApiResponse<Course[]> = await response.json();
    return data.data;
};

export const useFetchCourses = (id?: string) => {
    const { data: session } = useSession();
    const token = session?.user?.token || null;

    const { data, error, mutate } = useSWR(
        token ? [id ? `${process.env.NEXT_PUBLIC_API_URL}/courses/${id}` : `${process.env.NEXT_PUBLIC_API_URL}/courses`, token] : null,
        ([url, token]) => fetcher(url, token),
        { revalidateOnFocus: false }
    );

    return {
        courses: data || [],
        isLoading: !error && !data,
        error,
        mutate,
    };
};