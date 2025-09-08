import {CloudUpload} from "@mui/icons-material";
import {Button, Paper, Typography} from "@mui/material";
import React, {Dispatch, SetStateAction} from "react";
import {styled} from "@mui/material/styles";

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

const DropZone = styled(Paper)(({ theme }) => ({
    border: `2px dashed ${theme.palette.grey[300]}`,
    borderRadius: theme.spacing(1),
    padding: theme.spacing(4),
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    '&:hover': {
        borderColor: theme.palette.primary.main,
        backgroundColor: theme.palette.action.hover,
    },
}));

type TDropZoneProps = {
    setCsvFile: Dispatch<SetStateAction<File | null>>;
    setError: Dispatch<SetStateAction<string>>;
    csvFile: File | null;
}

export const DropZoneInput = ({setError, csvFile, setCsvFile }: TDropZoneProps) => {

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type === 'text/csv') {
            setCsvFile(file);
            setError('');
        } else {
            setError('Будь ласка, оберіть CSV файл');
            setCsvFile(null);
        }
    };

    return <DropZone>
        <CloudUpload sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
        <Button
            component="label"
            variant="outlined"
            startIcon={<CloudUpload />}
            sx={{ mb: 2 }}
        >
            {csvFile ? csvFile.name : 'Оберіть CSV файл з даними'}
            <VisuallyHiddenInput
                type="file"
                accept=".csv"
                onChange={handleFileChange}
            />
        </Button>
        <Typography variant="body2" color="text.secondary">
            Підтримуються тільки CSV файли
        </Typography>
    </DropZone>
}