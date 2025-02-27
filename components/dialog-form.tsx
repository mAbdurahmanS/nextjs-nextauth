import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ReactNode } from "react";

interface DialogFormProps {
    trigger: ReactNode;
    title: string;
    description: string;
    children?: ReactNode;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

const DialogForm = ({ trigger, title, description, children, isOpen, onOpenChange }: DialogFormProps) => {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                {children}
            </DialogContent>
        </Dialog>
    );
};

export default DialogForm;