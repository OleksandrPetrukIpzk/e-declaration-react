import {useParams} from "react-router-dom";
import {ClinicDaoService} from "../services/clinicDaoService";
import {UserType} from "../types/userTypes";
import {useEffect, useState} from "react";
import {Button, Stack, Typography} from "@mui/material";
import {AvatarIcon} from "../components/AvatarIcon";
import {LandingScreenHeader} from "../components/LandingScreenHeader";

export const ClinicInvites = () => {
    const [usersList, setUserList] = useState<UserType[] | null>();
    const { id } = useParams<{ id: string }>();

    const handleAccept = async (userId: number) => {
        const data = await ClinicDaoService.inviteConfirm(Number(id), userId);
        setUserList(data.invites);
    }

    const handleReject = async (userId: number) => {
        const data = await ClinicDaoService.inviteReject(Number(id), userId);
        setUserList(data.invites);
    }

    useEffect(() => {
        const getInvites = async () => {
            const data = await ClinicDaoService.getAllInvites(Number(id));
            setUserList(data);
        }
        getInvites();
    }, []);

    return (
        <Stack>
            <LandingScreenHeader />
            {usersList?.map((item) => (
                <Stack key={item.id} direction={'row'} gap={2} padding={3} border={'1px solid black'} borderRadius={4}>
                    <AvatarIcon firstName={item.firstName} lastName={item.lastName} size={60} />
                    <Stack>
                        <Typography>{item.firstName} {item.lastName}</Typography>
                        <Typography>{item.profession}</Typography>
                        <Typography>{item.region}</Typography>
                        <Typography>{item.address}</Typography>
                    </Stack>
                    <Button onClick={() => handleAccept(item.id)}>Accept</Button>
                    <Button onClick={() => handleReject(item.id)}>Reject</Button>
                </Stack>
            ))}
        </Stack>
    )
}