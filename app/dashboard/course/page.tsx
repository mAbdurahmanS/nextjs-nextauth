"use client";

import { Button } from '@/components/ui/button';
import DialogForm from '@/components/dialog-form';
import { useFetchCourses } from '@/hooks/useFetchCourses';
import { Course } from "@/types/course";
import FormCourse from './(action)/form-course';
import { useState } from 'react';
import AlertForm from '@/components/alert-form';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Ellipsis } from 'lucide-react';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import FormLesson from './(action)/form-lesson';
import { useSession } from 'next-auth/react';


export default function CoursePage() {
    const { data: session } = useSession();
    const token = session?.user?.token || null;

    const { courses, isLoading, error, mutate } = useFetchCourses();

    const [isOpenCourseById, setIsOpenCourseById] = useState<string | null>(null);
    const [isOpenLessonById, setIsOpenLessonById] = useState<string | null>(null);

    const [isOpen, setIsOpen] = useState(false);

    const [alert, setAlert] = useState({ isOpen: false, type: "success", message: "" });

    const showAlert = (type: "success" | "error", message: string) => {
        setAlert({ isOpen: true, type, message });
    };

    const [expandedCourses, setExpandedCourses] = useState<Record<string, boolean>>({});

    const toggleExpand = (courseId: string) => {
        setExpandedCourses(prev => ({ ...prev, [courseId]: !prev[courseId] }));
    };

    const handleDeleteCourse = async (id: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            if (response.ok) {
                showAlert("success", "Course deleted successfully!");
                mutate();
            } else {
                showAlert("error", "Failed to delete course.");
            }
        } catch (error) {
            showAlert("error", "Something went wrong!");
        }
    };

    const handleDeleteLesson = async (id: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/lessons/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            if (response.ok) {
                showAlert("success", "Lesson deleted successfully!");
                mutate();
            } else {
                showAlert("error", "Failed to delete lesson.");
            }
        } catch (error) {
            showAlert("error", "Something went wrong!");
        }
    };

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className="flex gap-6">
                <DialogForm
                    trigger={<Button>Add Course</Button>}
                    title="Add a New Course"
                    description="Fill in the details to create a new course."
                    isOpen={isOpen}
                    onOpenChange={setIsOpen}
                >
                    <FormCourse
                        onSuccess={() => {
                            setIsOpen(false)
                            mutate()
                            showAlert("success", "Course added successfully!");
                        }} />
                </DialogForm>
            </div>

            {isLoading && <p>Loading courses...</p>}
            {error && <p className="text-red-500">Failed to load courses.</p>}

            {/* {!isLoading && !error && (
                <Table>
                    <TableCaption>A list of your recent courses.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px] text-center">No.</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className='w-[100px]'></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {courses.length > 0 ? (
                            courses.map((course: Course, index: number) => (
                                <TableRow key={course.id}>
                                    <TableCell className="text-center">{index + 1}.</TableCell>
                                    <TableCell className="font-medium">{course.title}</TableCell>
                                    <TableCell>{course.description}</TableCell>
                                    <TableCell className='flex items-center justify-end gap-2'>
                                        <DialogForm
                                            trigger={
                                                <Button onClick={() => setIsOpenCourseById(course.id)}>Edit</Button>
                                            }
                                            title="Edit Course"
                                            description="Modify the course details."
                                            isOpen={isOpenCourseById === course.id}
                                            onOpenChange={(isOpen) => setIsOpenCourseById(isOpen ? course.id : null)}
                                        >
                                            <Form
                                                course={course}
                                                onSuccess={() => {
                                                    // setIsOpen(false)
                                                    setIsOpenCourseById(null);
                                                    mutate()
                                                    showAlert("success", "Course updated successfully!")
                                                }} />
                                        </DialogForm>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button>Delete</Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This action cannot be undone. This will permanently delete your
                                                        data.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDelete(course.id)}>Continue</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center">No courses found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            )} */}

            <div className="grid grid-cols-3 gap-6">

                {!isLoading && !error ? (
                    courses.length > 0 ? (
                        courses.map((course: Course) => (
                            <div key={course.id}>
                                <Card className="w-full">
                                    <CardHeader>
                                        <div className="flex justify-between items-center">
                                            <div className="flex flex-col gap-1">
                                                <CardTitle className="text-lg font-semibold">{course.title}</CardTitle>
                                                <CardDescription className="text-sm text-gray-600">
                                                    {course.description}
                                                </CardDescription>
                                            </div>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <Ellipsis />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    <DropdownMenuItem asChild>
                                                        <DialogForm
                                                            trigger={<Button variant="ghost" className='w-full' onClick={() => setIsOpenCourseById(course.id)}>Edit</Button>}
                                                            title="Edit Course"
                                                            description="Modify the course details."
                                                            isOpen={isOpenCourseById === course.id}
                                                            onOpenChange={(isOpen) => setIsOpenCourseById(isOpen ? course.id : null)}
                                                        >
                                                            <FormCourse
                                                                course={course}
                                                                onSuccess={() => {
                                                                    setIsOpenCourseById(null);
                                                                    mutate();
                                                                    showAlert("success", "Course updated successfully!");
                                                                }}
                                                            />
                                                        </DialogForm>
                                                    </DropdownMenuItem>

                                                    <DropdownMenuItem asChild>
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <Button variant="ghost" className='w-full'>Delete</Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>Are you sure want to delete {course.title} ?</AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        This action cannot be undone. This will permanently delete your data.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                    <AlertDialogAction onClick={() => handleDeleteCourse(course.id)}>Continue</AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </DropdownMenuItem>

                                                    <DropdownMenuSeparator />

                                                    <DropdownMenuItem asChild>
                                                        <DialogForm
                                                            trigger={<Button variant="ghost" className='w-full' onClick={() => setIsOpenLessonById(course.id)}>Add Lesson</Button>}
                                                            title="Add a New Lesson"
                                                            description="Fill in the details to create a new lesson."
                                                            isOpen={isOpenLessonById === course.id}
                                                            onOpenChange={(isOpen) => setIsOpenLessonById(isOpen ? course.id : null)}
                                                        >
                                                            <FormLesson
                                                                courseId={course?.id}
                                                                onSuccess={() => {
                                                                    setIsOpenLessonById(null);
                                                                    mutate()
                                                                    showAlert("success", "Lesson added successfully!");
                                                                }} />
                                                        </DialogForm>
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </CardHeader>
                                    <hr className="mx-auto w-4/5 border-gray-200" />
                                    <CardContent>
                                        {course?.lessons && course.lessons.length > 0 ? (
                                            <div className="flex flex-col gap-2">
                                                {course.lessons.slice(0, expandedCourses[course.id] ? course.lessons.length : 3).map((lesson) => (
                                                    <div key={lesson.id} className="flex justify-between items-center">
                                                        <p className="text-sm text-gray-700">{lesson.title}</p>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon">
                                                                    <Ellipsis />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent>
                                                                <DropdownMenuItem asChild>
                                                                    <DialogForm
                                                                        trigger={
                                                                            <Button variant="ghost" className='w-full' onClick={() => setIsOpenLessonById(lesson.id)}>Edit</Button>
                                                                        }
                                                                        title="Edit Lesson"
                                                                        description="Modify the lesson details."
                                                                        isOpen={isOpenLessonById === lesson.id}
                                                                        onOpenChange={(isOpen) => setIsOpenLessonById(isOpen ? lesson.id : null)}
                                                                    >
                                                                        <FormLesson
                                                                            courseId={course?.id}
                                                                            lessonId={lesson?.id}
                                                                            onSuccess={() => {
                                                                                setIsOpenLessonById(null);
                                                                                mutate()
                                                                                showAlert("success", "Lesson updated successfully!")
                                                                            }} />
                                                                    </DialogForm>
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem asChild>
                                                                    <AlertDialog>
                                                                        <AlertDialogTrigger asChild>
                                                                            <Button variant="ghost" className='w-full'>Delete</Button>
                                                                        </AlertDialogTrigger>
                                                                        <AlertDialogContent>
                                                                            <AlertDialogHeader>
                                                                                <AlertDialogTitle>Are you sure want to delete {lesson.title} ?</AlertDialogTitle>
                                                                                <AlertDialogDescription>
                                                                                    This action cannot be undone. This will permanently delete your
                                                                                    data.
                                                                                </AlertDialogDescription>
                                                                            </AlertDialogHeader>
                                                                            <AlertDialogFooter>
                                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                                <AlertDialogAction onClick={() => handleDeleteLesson(lesson.id)}>Continue</AlertDialogAction>
                                                                            </AlertDialogFooter>
                                                                        </AlertDialogContent>
                                                                    </AlertDialog>
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-center text-gray-500">No lesson found.</p>
                                        )}
                                    </CardContent>
                                    {course?.lessons && course?.lessons?.length > 3 && (
                                        <CardFooter className="flex justify-center">
                                            <Button variant="link" className="text-blue-500" onClick={() => toggleExpand(course.id)}>
                                                {expandedCourses[course.id] ? "Show Less" : "Show More"}
                                            </Button>
                                        </CardFooter>
                                    )}
                                </Card>
                            </div>
                        ))
                    ) : (
                        <p className="text-center col-span-3 text-gray-500">No courses found.</p>
                    )
                ) : null}
            </div>

            <AlertForm
                type={alert.type as "success" | "error"}
                message={alert.message}
                isOpen={alert.isOpen}
                onClose={() => setAlert((prev) => ({ ...prev, isOpen: false }))}
            />
        </div>
    );
}