import {useEffect, useState} from "react";
import {ClinicType} from "../types/clinic.types";
import {ClinicDaoService} from "../services/clinicDaoService";
import {Button, Stack, Typography} from "@mui/material";
import {LandingScreenHeader} from "../components/LandingScreenHeader";
import {useUserData} from "../hooks/useUserData";
import {UserType} from "../constants/userConsts";


export const ActiveClinicList = () => {
    const [clinicList, setClinicList] = useState<ClinicType[] | null>(null);
    const {user} = useUserData();
    const isDoctor = user?.role === UserType.Hospital;
    useEffect(() => {
        const getMyClinic = async () => {
            const res = await ClinicDaoService.getActiveClinics();
            setClinicList(res)
        }
        getMyClinic();
    }, []);

    const handleInviteToClinic = async (clinicId: number) => {
        const response = isDoctor ? await ClinicDaoService.joinToClinicAsWorker(clinicId) : await ClinicDaoService.invite(clinicId);
    }
    return (<Stack>
        <LandingScreenHeader />
        <Stack ml={2} mt={2} direction="row" spacing={2}>
            {clinicList?.map((clinic) => (
                <Stack key={clinic.id} direction={'column'} border={'1px solid black'} padding={2} borderRadius={2}>
                    <Stack>
                    <Typography>Імя клініки: {clinic.clinicName}</Typography>
                    <Typography>{clinic.clinicBio && 'Опис клініки: ' + clinic.clinicBio}</Typography>
                    </Stack>
                    <Button disabled={clinic?.clinicAdmins?.some((clinicUser) => clinicUser.id === user?.id) || clinic?.clinicWorkers?.some((clinicUser) => clinicUser.id === user?.id)} onClick={() => handleInviteToClinic(clinic.id)}>Доєднатися</Button>
                </Stack>
            ))}
        </Stack>
    </Stack>)
}