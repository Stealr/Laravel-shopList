import { Outlet } from 'react-router-dom';
import { AppShell } from '@mantine/core';

import { useDisclosure } from '@mantine/hooks';

import Header from '../../../components/ui/Header/Header';
import { NavbarNested } from '../../../components/ui/NavbarNested/NavbarNested';
import { NavigationTabs } from '../../../components/ui/NavigationTabs/NavigationTabs';


const MainLayout = () => {
    const [opened, { toggle }] = useDisclosure();

    return (
        <AppShell
            layout="alt"
            header={{ height: 64 }}
            navbar={{ width: 256, breakpoint: 'sm', collapsed: { desktop: opened, mobile: !opened } }}
            padding="md"
        >
            <AppShell.Header>
                <Header opened={opened} toggle={toggle} />
            </AppShell.Header>

            <AppShell.Navbar p={0}>
                <NavbarNested />
            </AppShell.Navbar>

            <AppShell.Main>
                <NavigationTabs />
                <main className="content" style={{ padding: 'var(--mantine-spacing-md)' }}>
                    <Outlet />
                </main>
            </AppShell.Main>
        </AppShell>
    );
};

export default MainLayout;
