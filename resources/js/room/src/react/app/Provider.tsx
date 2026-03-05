import { Outlet } from 'react-router-dom';
import '@mantine/core/styles.css';
import { MantineProvider, createTheme } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5,
            gcTime: 1000 * 60 * 15,
            retry: 1,
            refetchOnWindowFocus: true,
        },
    },
});

const theme = createTheme({
    primaryColor: 'blue',
    defaultRadius: 'md',
});

function Provider() {
    return (
        <QueryClientProvider client={queryClient}>
            <MantineProvider theme={theme}>
                <Outlet />
            </MantineProvider>
        </QueryClientProvider>
    );
}

export default Provider;
