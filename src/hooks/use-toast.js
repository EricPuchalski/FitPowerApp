import { useState } from 'react';
const useToast = () => {
    const [toasts, setToasts] = useState([]);
    const showToast = (message, type = 'info') => {
        const id = Date.now();
        setToasts((prevToasts) => [...prevToasts, { id, message, type }]);
        setTimeout(() => {
            setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
        }, 3000);
    };
    return { toasts, showToast };
};
export default useToast;
