import { UnstyledButton, Group, Avatar, Text, Skeleton } from "@mantine/core";
import classes from "./UserButton.module.css";
import { useUser } from "../../../hooks/api/useUser";

export function UserButton() {
    const { data: user, isLoading, isError } = useUser();

    return (
        <UnstyledButton className={classes.user}>
            <Group>
                {isLoading ? (
                    <Skeleton circle height={38} />
                ) : (
                    <Avatar radius="xl" color="gray" size={36}>
                        {user ? user.name[0].toUpperCase() : "?"}
                    </Avatar>
                )}

                <div style={{ flex: 1 }}>
                    {isLoading ? (
                        <Skeleton height={16} width="80%" />
                    ) : (
                        <Text size="sm" fw={500}>
                            {user ? user.name : "Unknown"}
                        </Text>
                    )}
                </div>
            </Group>
        </UnstyledButton>
    );
}
