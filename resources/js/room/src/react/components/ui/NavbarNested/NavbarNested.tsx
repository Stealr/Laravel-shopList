import {
    IconHome,
    IconApps,
    IconFile,
    IconStack2,
    IconBook,
    IconUsers,
    IconBookmark,
    IconUser,
    IconSettings,
    IconPencil,
    IconLogout,
} from '@tabler/icons-react';
import { Group, ScrollArea, TextInput, UnstyledButton, rem, Text } from '@mantine/core';
import { logout } from '../../../service/api/userApi';
import { LinksGroup } from '../NavbarLinksGroup/NavbarLinksGroup';
import { UserButton } from '../UserButton/UserButton';
import paths from '../../../app/paths';
import classes from './NavbarNested.module.css';

const menuData = [
    { label: 'Home', icon: IconHome, link: paths.home },
    {
        label: 'Apps',
        icon: IconApps,
        badge: '2',
        initiallyOpened: true,
        link: paths.apps,
        links: [
            { label: 'All Apps', link: paths.apps },
            { label: 'Recent', link: paths.apps },
            { label: 'Updates', link: paths.apps, badge: '2' },
            { label: 'Installed', link: paths.apps },
        ],
    },
    {
        label: 'Files',
        icon: IconFile,
        link: paths.files,
        links: [],
    },
    {
        label: 'Projects',
        icon: IconStack2,
        badge: '4',
        link: paths.projects,
        links: [],
    },
    {
        label: 'Learn',
        icon: IconBook,
        link: paths.learn,
        links: [],
    },
    {
        label: 'Community',
        icon: IconUsers,
        links: [],
    },
    {
        label: 'Resources',
        icon: IconBookmark,
        links: [],
    },
    { label: 'Profile', icon: IconUser, link: paths.profile },
];

export function NavbarNested() {
    const links = menuData.map((item) => <LinksGroup {...item} key={item.label} />);

    const handleLogout = async () => {
        await logout();
        window.location.href = '/';
    };

    return (
        <nav className={classes.navbar}>
            <div>
                <div className={classes.logo}>
                    <div className={classes.logoIcon}>
                        <IconPencil size={24} stroke={1.5} />
                    </div>
                    <div className={classes.logoText}>
                        <Text className={classes.logoTitle}>Designali</Text>
                        <Text className={classes.logoSubtitle}>Creative Suite</Text>
                    </div>
                </div>

                <div className={classes.searchWrapper}>
                    <TextInput
                        placeholder="Search..."
                        size="xs"
                        styles={{
                            input: {
                                borderRadius: rem(8),
                            },
                        }}
                    />
                </div>
            </div>

            <ScrollArea className={classes.links}>
                <div className={classes.linksInner}>{links}</div>
            </ScrollArea>

            <div className={classes.footer}>
                <UnstyledButton className={classes.settingsButton}>
                    <Group gap="xs">
                        <IconSettings size={20} stroke={1.5} />
                        <span>Settings</span>
                    </Group>
                </UnstyledButton>
                <UnstyledButton className={classes.settingsButton} onClick={handleLogout}>
                    <Group gap="xs">
                        <IconLogout size={20} stroke={1.5} />
                        <span>Logout</span>
                    </Group>
                </UnstyledButton>
                <UserButton />
            </div>
        </nav>
    );
}
