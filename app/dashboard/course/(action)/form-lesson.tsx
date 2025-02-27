"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { Lesson } from "@/types/lesson";
import { useFetchLessons } from "@/hooks/useFetchLessons";
import { useSession } from "next-auth/react";

const lessonSchema = z.object({
    course_id: z.string().uuid(),
    title: z.string().min(3, "Title must be at least 3 characters").max(255, "Title is too long").trim(),
    content: z.string().min(10, "Content must be at least 10 characters").trim(),
});

type FormData = z.infer<typeof lessonSchema>;

interface FormProps {
    courseId: string;  // ⬅️ Buat wajib agar tidak perlu select
    lessonId?: string;
    onSuccess?: () => void;
    onClose?: () => void;
}

const FormLesson = ({ courseId, lessonId, onSuccess, onClose }: FormProps) => {
    const { data: session } = useSession();
    const token = session?.user?.token || null;

    const { lesson } = useFetchLessons(lessonId) as { lesson: Lesson | null };

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(lessonSchema),
        defaultValues: {
            course_id: courseId,
            title: "",
            content: "",
        },
    });

    const [message, setMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (lesson) {
            setValue("title", lesson.title);
            setValue("content", lesson.content);
        }
    }, [lesson, setValue]);

    // useEffect(() => {
    //     if (lesson) {
    //         reset({
    //             title: lesson.title,
    //             content: lesson.content,
    //         });
    //     }
    // }, [lesson, reset]);

    const onSubmit = async (data: FormData) => {
        setLoading(true);
        setMessage(null);

        try {
            const url = lesson
                ? `${process.env.NEXT_PUBLIC_API_URL}/lessons/${lesson.id}`
                : `${process.env.NEXT_PUBLIC_API_URL}/lessons`;

            const method = lesson ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok) {
                reset();
                onSuccess?.();
                onClose?.();
            } else {
                setMessage(result.message || "Failed to save lesson.");
            }
        } catch (error) {
            setMessage("Something went wrong!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <Label htmlFor="title">Lesson Title</Label>
                <Input id="title" {...register("title")} placeholder="Enter lesson title" />
                {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
            </div>

            <div>
                <Label htmlFor="content">Content</Label>
                <Textarea id="content" placeholder="Enter content" {...register("content")} />
                {errors.content && <p className="text-sm text-red-500">{errors.content.message}</p>}
            </div>

            <Button type="submit" disabled={loading}>
                {loading ? "Submitting..." : lesson ? "Update" : "Submit"}
            </Button>

            {message && <p className="text-sm text-green-500">{message}</p>}
        </form>
    );
};

export default FormLesson;