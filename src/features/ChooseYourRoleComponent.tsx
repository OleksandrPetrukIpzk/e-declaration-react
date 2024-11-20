import {List, ListItem, ListItemDecorator, Radio, RadioGroup} from "@mui/joy";
import {People, Person} from "@mui/icons-material";
import {Dispatch, SetStateAction} from "react";
import {UserType} from "../constants/userConsts";

type ChooseYourRoleComponentType = {
    selectedValue: string
    setSelectedValue: Dispatch<SetStateAction<keyof typeof UserType>>
}

export const ChooseYourRoleComponent = ({selectedValue, setSelectedValue}: ChooseYourRoleComponentType) => {


    return( <RadioGroup aria-label="Your plan" name="people" defaultValue="Individual" value={selectedValue} onChange={(e: any) => setSelectedValue(e.target.defaultValue)}>
        <List
            sx={{
                minWidth: 240,
                '--List-gap': '0.5rem',
                '--ListItem-paddingY': '1rem',
                '--ListItem-radius': '8px',
                '--ListItemDecorator-size': '32px',
                color: 'white'
            }}
        >
            {['Individual', 'Hospital',].map((item, index) => (
                <ListItem variant="outlined" key={item} sx={{boxShadow: 'sm'}}>
                    <ListItemDecorator sx={{color: 'white'}}>
                        {[<Person/>, <People/>][index]}
                    </ListItemDecorator>
                    <Radio
                        overlay
                        value={item}
                        label={item}
                        sx={{flexGrow: 1, flexDirection: 'row-reverse'}}
                        slotProps={{
                            label: {
                                sx: {
                                    color: 'white',
                                },
                            },

                            action: ({ checked }) => ({
                                sx: (theme) => ({
                                    ...(checked && {
                                        inset: -1,
                                        border: '3px solid',
                                        borderColor: '#36981D',
                                    }),
                                }),
                            }),
                        }}
                    />
                </ListItem>
            ))}
        </List>
    </RadioGroup>)
}