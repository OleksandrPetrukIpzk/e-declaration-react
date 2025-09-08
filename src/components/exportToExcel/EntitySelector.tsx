import {
    Card,
    CardContent,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Typography
} from "@mui/material";
import React, {Dispatch, SetStateAction} from "react";
import {EntityType} from "../../types/export.types";
import {ENTITY_CONFIGS} from "../../constants/exportConstants";

type TEntitySelectorProps = {
    selectedEntity: EntityType;
    setSelectedEntity: Dispatch<SetStateAction<EntityType>>;
    setError: Dispatch<SetStateAction<string>>;
}

export const EntitySelector = ({setSelectedEntity, setError, selectedEntity}: TEntitySelectorProps) => {

    const handleEntityChange = (event: SelectChangeEvent<EntityType>) => {
        setSelectedEntity(event.target.value as EntityType);
        setError('');
    };

    return (<Card variant="outlined">
        <CardContent>
            <Typography variant="h6" gutterBottom>
                Тип ентіті
            </Typography>
            <FormControl fullWidth>
                <InputLabel>Оберіть тип ентіті</InputLabel>
                <Select
                    value={selectedEntity}
                    onChange={handleEntityChange}
                    label="Оберіть тип ентіті"
                >
                    {Object.entries(ENTITY_CONFIGS).map(([key, config]) => (
                        <MenuItem key={key} value={key}>
                            {config.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </CardContent>
    </Card>)
}