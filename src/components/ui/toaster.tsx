import { useToast } from "@/hooks/use-toast";
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "@/components/ui/toast";
import { CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

function ToastIcon({ variant }: { variant?: string }) {
  switch (variant) {
    case "success":
      return <CheckCircle className="h-5 w-5 shrink-0 text-success" aria-hidden />;
    case "destructive":
      return <AlertCircle className="h-5 w-5 shrink-0 text-destructive" aria-hidden />;
    case "warning":
      return <AlertTriangle className="h-5 w-5 shrink-0 text-warning" aria-hidden />;
    case "info":
      return <Info className="h-5 w-5 shrink-0 text-info" aria-hidden />;
    default:
      return null;
  }
}

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant, ...props }) {
        return (
          <Toast key={id} variant={variant} {...props}>
            <ToastIcon variant={variant} />
            <div className="grid gap-1 min-w-0 flex-1">
              {title && (
                <ToastTitle
                  className={
                    variant === "success"
                      ? "text-success"
                      : variant === "destructive"
                        ? "text-destructive"
                        : variant === "warning"
                          ? "text-warning"
                          : variant === "info"
                            ? "text-info"
                            : undefined
                  }
                >
                  {title}
                </ToastTitle>
              )}
              {description && (
                <ToastDescription className={variant === "destructive" ? undefined : "text-foreground/90"}>
                  {description}
                </ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
