import {useEffect, useState} from "react";
import {UserType} from "../types/userTypes";
import {UserDaoService} from "../services/userDaoService";
import {LandingScreenHeader} from "../components/LandingScreenHeader";
import {Grid2, Typography} from "@mui/material";
import {Stack} from "@mui/material";
import {AvatarIcon} from "../components/AvatarIcon";
import {TagComponent} from "../components/TagComponent";

export const AllAdminsList = () => {
    const [usersList, setUsersList] = useState<UserType[] | null>(null);

    useEffect(() => {
        const handleFetchData = async () => {
            const data = await UserDaoService.getAllAdminList();
            setUsersList(data);
        }
        handleFetchData();
    },[]);

    return (
        <>
            <LandingScreenHeader />
            <Grid2 container spacing={2} padding={1}>
                {usersList && usersList?.map((item) => (
                    <Stack key={item.id} direction={'row'} gap={2} padding={3} border={'1px solid black'} borderRadius={4}>
                        <AvatarIcon firstName={item.firstName} lastName={item.lastName} size={60} />
                        <Stack>
                            <Typography>Full name: {item.firstName} {item.lastName}</Typography>
                            <Typography>Email: {item.email}</Typography>
                            <Typography>Phone number: {item.phone}</Typography>
                            <Typography>Specialization: {item.profession}</Typography>
                            <Typography>Region: {item.region}</Typography>
                            <Typography>Address: {item.address}</Typography>
                            {item.isActive ? <TagComponent styles={{background: 'lightgreen', color: 'black'}} text={'Active'}/> : <TagComponent styles={{background: 'red', color: 'white'}} text={'Inactive'}/>}
                        </Stack>
                    </Stack>
                ))}
            </Grid2>
        </>
    )
}