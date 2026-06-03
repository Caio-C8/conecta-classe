interface FieldErrorProps {
  message?: string;
}

export function FieldError({ message }: FieldErrorProps) {
  return (
    <span className="text-xs text-destructive font-medium">{message}</span>
  );
}
