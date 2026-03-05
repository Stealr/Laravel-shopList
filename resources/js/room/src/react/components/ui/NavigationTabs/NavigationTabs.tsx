import { Tabs } from '@mantine/core';
import { useLocation, useNavigate } from 'react-router-dom';
import paths from '../../../app/paths';
import classes from './NavigationTabs.module.css';

const tabsData = [
    { value: paths.home, label: 'Home' },
    { value: paths.apps, label: 'Apps' },
    { value: paths.files, label: 'Files' },
    { value: paths.projects, label: 'Projects' },
    { value: paths.learn, label: 'Learn' },
    { value: paths.profile, label: 'Profile' },
];

export function NavigationTabs() {
    const location = useLocation();
    const navigate = useNavigate();

    return (
        <Tabs
            value={location.pathname}
            onChange={(value) => value && navigate(value)}
            variant="unstyled"
            classNames={{
                root: classes.root,
                list: classes.list,
                tab: classes.tab,
            }}
        >
            <Tabs.List>
                {tabsData.map((tab) => (
                    <Tabs.Tab key={tab.value} value={tab.value}>
                        {tab.label}
                    </Tabs.Tab>
                ))}
            </Tabs.List>
        </Tabs>
    );
}