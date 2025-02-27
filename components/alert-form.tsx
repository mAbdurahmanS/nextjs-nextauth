import { useEffect } from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface AlertProps {
    type: "success" | "error";
    message: string;
    isOpen: boolean;
    onClose: () => void;
}

const AlertForm = ({ type, message, isOpen, onClose }: AlertProps) => {
    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => {
                onClose();
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed top-4 right-4 z-50">
            <Alert className={` ${type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                <AlertTitle>{type === "success" ? "Success!" : "Error!"}</AlertTitle>
                <AlertDescription>{message}</AlertDescription>
            </Alert>
        </div>
    );
};

export default AlertForm;