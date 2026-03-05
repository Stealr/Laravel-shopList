import { IconCloud, IconMessage, IconBell, IconLayoutSidebar } from '@tabler/icons-react';
import { Group, Avatar, ActionIcon, Indicator, Text, Skeleton, Tooltip } from '@mantine/core';
import { useUser } from '@hooks/api/useUser';

function Header({ toggle }: { opened: boolean; toggle: () => void }) {
    const { data: user, isLoading, isError } = useUser();

    return (
        <Group h="100%" px="md" justify="space-between">
            <Group>
                <ActionIcon variant="subtle" size="lg" color="black">
                    <IconLayoutSidebar onClick={toggle} />
                </ActionIcon>

                <Text fw={600} size="lg">
                    Designali Creative
                </Text>
            </Group>

            <Group gap="md">
                <ActionIcon variant="subtle" size="lg" color="black">
                    <IconCloud />
                </ActionIcon>

                <ActionIcon variant="subtle" size="lg" color="black">
                    <IconMessage />
                </ActionIcon>

                <Indicator inline label="5" size={16} color="red" position="top-end" offset={5}>
                    <ActionIcon variant="subtle" size="lg" color="black">
                        <IconBell />
                    </ActionIcon>
                </Indicator>

                {isLoading ? (
                    <Skeleton circle height={38} />
                ) : isError || !user ? (
                    <Avatar radius="xl" color="red" size="md">?</Avatar>
                ) : (
                    <Tooltip label={user.name} withArrow position="bottom">
                        <Avatar
                            radius="xl"
                            color="blue"
                            size="md"
                            src={user.avatar ?? null}
                            alt={user.name}
                        >
                            {user.name[0].toUpperCase()}
                        </Avatar>
                    </Tooltip>
                )}
            </Group>
        </Group>
    );
}

export default Header;
