import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const useIdleTimeout = (timeout = 5000, onIdle) => {

    const location = useLocation();

    useEffect(() => {
        let timer;

        const resetTimer = () => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                if (location.pathname !== '/') {
                    onIdle();
                }
            }, timeout);
        };

        const handleActivity = () => resetTimer();

        window.addEventListener('mousemove', handleActivity);
        window.addEventListener('keypress', handleActivity);
        window.addEventListener('click', handleActivity);
        window.addEventListener('scroll', handleActivity);

        resetTimer();

        return () => {
            clearTimeout(timer);
            window.removeEventListener('mousemove', handleActivity);
            window.removeEventListener('keypress', handleActivity);
            window.removeEventListener('click', handleActivity);
            window.removeEventListener('scroll', handleActivity);
        };
    }, [timeout, onIdle, location.pathname]);
};

export default useIdleTimeout;