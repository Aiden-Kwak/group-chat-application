import { useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getCookie } from '../utils/useCookie';

function LogoutForm() {
    const navigate = useNavigate();

    const handleLogout = useCallback(async () => {
        const csrfToken = getCookie('csrftoken');
        try {
            await axios.post('http://localhost:8000/accounts/logout/', {}, {
                headers: {
                    'X-CSRFToken': csrfToken
                },
                withCredentials: true
            });
            localStorage.removeItem('username');
            alert('Logout successful');
        } catch (error) {
            alert("Logout failed");
            console.error('Logout error:', error);
        } finally {
            navigate('/', { replace: true });
        }
    }, [navigate]);

    useEffect(() => {
        handleLogout();
    }, [handleLogout]);

    return null;
}

export default LogoutForm;
