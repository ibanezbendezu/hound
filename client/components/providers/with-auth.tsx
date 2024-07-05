import {useAuthStore} from '@/store/auth';
import {useEffect} from 'react';

const withAuth = () => {
    let auth = false;

    useEffect(() => {
        auth = useAuthStore((state) => state.isAuth);
    }, []);

    return auth;
};

export default withAuth;