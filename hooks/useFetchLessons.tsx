import useSWR from "swr";
import { ApiResponse, Lesson } from "@/types/lesson";
import { useSession } from "next-auth/react";

const fetcher = async (url: string, token: string | null): Promise<Lesson[]> => {
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

    const data: ApiResponse<Lesson[]> = await response.json();
    return data.data;
};

export const useFetchLessons = (id?: string) => {
    const { data: session } = useSession();
    const token = session?.user?.token || null;

    const { data, error, mutate } = useSWR(
        token ? [id ? `${process.env.NEXT_PUBLIC_API_URL}/lessons/${id}` : `${process.env.NEXT_PUBLIC_API_URL}/lessons`, token] : null,
        ([url, token]) => fetcher(url, token),
        { revalidateOnFocus: false }
    );

    return {
        lesson: Array.isArray(data) ? null : data,
        lessons: Array.isArray(data) ? data : [],
        isLoading: !error && !data,
        error,
        mutate,
    };
};