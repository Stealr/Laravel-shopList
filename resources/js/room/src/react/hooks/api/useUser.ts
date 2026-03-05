import { useQuery } from '@tanstack/react-query';
import { getUser } from '../../service/api/userApi';

export const useUser = () => {
    return useQuery({
        queryKey: ['user'],
        queryFn: getUser,
        staleTime: 1000 * 60 * 5, // 5 минут
        retry: false,
    });
};
