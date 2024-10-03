interface Window {
    toast: (type: 'success' | 'info' | 'warn' | 'error', summary: string, message: string) => void;
}
