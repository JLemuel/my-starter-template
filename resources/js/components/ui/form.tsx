import { Input } from "./input";
import { Textarea } from "./textarea";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: string;
}

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    error?: string;
}

export function FormInput({ error, ...props }: FormInputProps) {
    return (
        <div className="space-y-1">
            <Input {...props} />
            {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
    );
}

export function FormTextarea({ error, ...props }: FormTextareaProps) {
    return (
        <div className="space-y-1">
            <Textarea {...props} />
            {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
    );
} 