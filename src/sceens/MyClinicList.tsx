import {useEffect, useState} from "react";
import {ClinicType} from "../types/clinic.types";
import {ClinicDaoService} from "../services/clinicDaoService";
import {Button, Stack, Typography} from "@mui/material";
import {LandingScreenHeader} from "../components/LandingScreenHeader";
import {useNavigate} from "react-router-dom";

export const MyClinicList = () => {
    const [clinicList, setClinicList] = useState<ClinicType[] | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const getMyClinic = async () => {
            const res = await ClinicDaoService.getClinics();
            setClinicList(res)
        }
        getMyClinic();
    }, []);

    return (<Stack>
        <LandingScreenHeader />
        <Stack>
            {clinicList?.map((clinic) => (
                <Stack ml={2} mt={2} direction="row" spacing={2} key={clinic.id}>
                    <Stack>
                    <Typography>Імя клініки {clinic.clinicName}</Typography>
                    <Typography>{clinic.clinicBio && 'Опис клініки: ' + clinic.clinicBio}</Typography>
                    <Typography>Дата створення : {new Date(clinic.dateOfCreate).toDateString()}</Typography>
                    </Stack>
                    <Stack>
                    <Button onClick={() => navigate(`/edit-clinic/${clinic.id}`)}>Едіт інформації</Button>
                    <Button onClick={() => navigate(`/invite-clinic/${clinic.id}`)} disabled={!clinic.invites?.length}>Користувачі які хочуть доєднатися {clinic.invites?.length}</Button>
                    </Stack>
                </Stack>
            ))}
        </Stack>
    </Stack>)
}