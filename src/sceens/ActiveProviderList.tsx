import {LandingScreenHeader} from "../components/LandingScreenHeader";
import {useEffect, useState} from "react";
import {UserType} from "../types/userTypes";
import {UserDaoService} from "../services/userDaoService";
import {Stack} from "@mui/material";
import {Grid2, Typography} from "@mui/material";
import {AvatarIcon} from "../components/AvatarIcon";

export const ActiveProviderList = () => {
    const [usersList, setUsersList] = useState<UserType[] | null>(null);

    useEffect(() => {
        const handleFetchData = async () => {
            const data = await UserDaoService.getActiveProviderList();
            setUsersList(data);
        }
        handleFetchData();
    },[]);

    return (
        <>
            <LandingScreenHeader />
            <Grid2 container spacing={2} padding={1}>
                {usersList?.map((item) => (
                    <Stack key={item.id} direction={'row'} gap={2} padding={3} border={'1px solid black'} borderRadius={4}>
                        <AvatarIcon firstName={item.firstName} lastName={item.lastName} size={60} />
                        <Stack>
                        <Typography>{item.firstName} {item.lastName}</Typography>
                        <Typography>{item.clinic?.clinicName}</Typography>
                        <Typography>{item.profession}</Typography>
                            <Typography>{item.region}</Typography>
                            <Typography>{item.address}</Typography>
                        </Stack>
                    </Stack>
                ))}
            </Grid2>
        </>
    )
};