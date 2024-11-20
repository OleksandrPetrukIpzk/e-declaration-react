import '@react-pdf-viewer/core/lib/styles/index.css';
import { useState, ChangeEvent } from 'react';
import {WatchPDFFileComponent} from "../features/WatchPDFFileComponent";
import {inputArrayWithOpikun, inputArrayWithoutOpikun} from "../constants/componentsConsts";
import {InputComponent} from "../components/InputComponent";
import {
    Accordion,
    AccordionDetails,
    AccordionGroup,
    AccordionSummary,
    FormControl, FormLabel,
    Stack
} from "@mui/joy";

export const CreateDocument = () => {

    const [inputValue, setInputValue] = useState<string[]>(['']);

    const handleInputChange= (id: number) => (e: ChangeEvent<HTMLInputElement>, ) => {
        const newValue = e.target.value;
        setInputValue(prevState => {
            const newArray = [...prevState];
            newArray[id] = newValue;
            return newArray;
        });
    };

    return (
        <div>
            <Stack direction="column" spacing={2}>
            {inputArrayWithoutOpikun.map((item) => (
                <FormControl>
                    <FormLabel>{item.placeholder}</FormLabel>
                <InputComponent color={'primary'} variant={'soft'} value={inputValue[item.id]} onChangeFunction={handleInputChange(item.id)} isDisable={false} placeholder={item.placeholder}/>
                </FormControl>
                ))}
                <AccordionGroup   color="primary"
                                  size="md"
                                  variant="outlined">
                <Accordion>
                    <AccordionSummary>Opicun</AccordionSummary>
                        <AccordionDetails>
                            <Stack spacing={2}>
                {inputArrayWithOpikun.map((item) => (
                    <FormControl>
                        <FormLabel>{item.placeholder}</FormLabel>
                        <InputComponent color={'primary'} variant={'soft'} value={inputValue[item.id]} onChangeFunction={handleInputChange(item.id)} isDisable={false} placeholder={item.placeholder}/>
                    </FormControl>
                ))}
                            </Stack>
                        </AccordionDetails>
                </Accordion>
                </AccordionGroup>
            </Stack>


            <WatchPDFFileComponent inputValue={inputValue}/>
        </div>
    );
};
