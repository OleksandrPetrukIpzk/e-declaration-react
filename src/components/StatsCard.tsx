import {Card, CardContent, Typography} from "@mui/material";

export const StatsCard = ({ title, value, color = 'primary' }: {
    title: string;
    value: number;
    color?: 'primary' | 'success' | 'warning' | 'error' | 'info';
}) => {
    return (
        <Card sx={{ height: '100%' }}>
            <CardContent>
                <Typography variant="h3" component="div" color={`${color}.main`} fontWeight="bold">
                    {value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {title}
                </Typography>
            </CardContent>
        </Card>
    );
};