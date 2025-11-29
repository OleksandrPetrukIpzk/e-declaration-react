import {useMemo} from "react";
import {Avatar} from "@mui/material";

type InitialsAvatarProps = {
    firstName: string | null;
    lastName: string | null;
    size?: number;
};

const getRandomColor = () => {
    const colors = [
        '#F44336', '#E91E63', '#9C27B0',
        '#673AB7', '#3F51B5', '#2196F3',
        '#03A9F4', '#00BCD4', '#009688',
        '#4CAF50', '#8BC34A', '#CDDC39',
        '#FFC107', '#FF9800', '#FF5722'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
};

export const AvatarIcon = ({ firstName, lastName, size = 40 }: InitialsAvatarProps) => {
    const initials = `${firstName ? firstName[0] : ''}${lastName ? lastName[0] : ''}`.toUpperCase();
    const bgColor = useMemo(() => getRandomColor(), []);
    return (
        <Avatar sx={{ bgcolor: bgColor, width: size, height: size }}>
            {initials}
        </Avatar>
    );
}