import {Typography} from "@mui/material";
import {Stack} from "@mui/joy";

type TTagComponent = {
    text: string,
    styles?: React.CSSProperties,
}

export const TagComponent = ({text, styles}: TTagComponent) => {

    return(<Stack paddingX={2} paddingY={1} style={styles} borderRadius={10}>
        <Typography variant='body1'>{text}</Typography>
    </Stack>)
}