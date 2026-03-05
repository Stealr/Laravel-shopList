import { useState } from 'react';
import { Group, Box, Collapse, Text, UnstyledButton, Badge, rem } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import { Link, useNavigate } from 'react-router-dom';
import classes from './NavbarLinksGroup.module.css';

interface LinksGroupProps {
    icon: React.FC<React.ComponentProps<'svg'>>;
    label: string;
    initiallyOpened?: boolean;
    link?: string;
    links?: { label: string; link: string; badge?: string | number }[];
    badge?: string | number;
}

export function LinksGroup({ icon: Icon, label, initiallyOpened, link, links, badge }: LinksGroupProps) {
    const hasLinks = Array.isArray(links) && links.length > 0;
    const [opened, setOpened] = useState(initiallyOpened || false);
    const navigate = useNavigate();

    const items = (hasLinks ? links : []).map((subLink) => (
        <Text
            component={Link}
            className={classes.link}
            to={subLink.link}
            key={subLink.label}
        >
            {subLink.label}
            {subLink.badge && (
                <Badge size="xs" variant="light" color="gray" ml="auto">
                    {subLink.badge}
                </Badge>
            )}
        </Text>
    ));

    const handleClick = () => {
        if (hasLinks) {
            setOpened((o) => !o);
        } else if (link) {
            navigate(link);
        }
    };

    return (
        <>
            <UnstyledButton onClick={handleClick} className={classes.control}>
                <Group justify="space-between" gap={0}>
                    <Box style={{ display: 'flex', alignItems: 'center' }}>
                        <Icon style={{ width: '20px', height: '20px' }} />
                        <Box ml="md">{label}</Box>
                    </Box>
                    {(badge || hasLinks) && (
                        <Box style={{ display: 'flex', alignItems: 'center', gap: rem(8) }}>
                            {badge && (
                                <Badge size="xs" variant="light" color="gray">
                                    {badge}
                                </Badge>
                            )}
                            {hasLinks && (
                                <IconChevronRight
                                    className={classes.chevron}
                                    stroke={1.5}
                                    style={{
                                        width: rem(16),
                                        height: rem(16),
                                        transform: opened ? 'rotate(90deg)' : 'none',
                                    }}
                                />
                            )}
                        </Box>
                    )}
                </Group>
            </UnstyledButton>
            {hasLinks ? <Collapse in={opened}>{items}</Collapse> : null}
        </>
    );
}
