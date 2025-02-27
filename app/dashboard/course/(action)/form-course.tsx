"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { Course } from "@/types/course";
import { useSession } from "next-auth/react";

const courseSchema = z.object({
    user_id: z.string().uuid(),
    title: z.string().min(3, "Title must be at least 3 characters").max(255, "Title is too long"),
    description: z.string().min(10, "Description must be at least 10 characters"),
});

type FormData = z.infer<typeof courseSchema>;

interface FormProps {
    course?: Course;
    onSuccess?: () => void;
    onClose?: () => void;
}

const FormCourse = ({ course, onSuccess, onClose }: FormProps) => {
    const { data: session } = useSession();
    const token = session?.user?.token || null;

    const [message, setMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<FormData>({
        resolver: zodResolver(courseSchema),
        defaultValues: {
            user_id: course?.user?.id || "01954287-8711-7399-b6bf-818723398e48",
            title: course?.title || "",
            description: course?.description || "",
        },
    });

    useEffect(() => {
        if (course) {
            reset({
                user_id: course.user.id,
                title: course.title,
                description: course.description,
            });
        }
    }, [course, reset]);

    const onSubmit = async (data: FormData) => {
        setLoading(true);
        setMessage(null);

        try {
            const url = course
                ? `${process.env.NEXT_PUBLIC_API_URL}/courses/${course.id}`
                : `${process.env.NEXT_PUBLIC_API_URL}/courses`;

            const method = course ? "PUT" : "POST";

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
                setMessage(result.message || "Failed to save course.");
            }
        } catch (error) {
            setMessage("Something went wrong!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input type="hidden" {...register("user_id")} />

            <div>
                <Label htmlFor="title">Course Title</Label>
                <Input id="title" {...register("title")} placeholder="Enter course title" />
                {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
            </div>

            <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" {...register("description")} placeholder="Enter description" />
                {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
            </div>

            <Button type="submit" disabled={loading}>
                {loading ? "Submitting..." : course ? "Update" : "Submit"}
            </Button>

            {message && <p className="text-sm text-green-500">{message}</p>}
        </form>
    );
};

export default FormCourse;