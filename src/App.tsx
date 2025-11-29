import React from 'react';
import {CreateDocument} from "./sceens/CreateDocument";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {LoginUser} from "./sceens/LoginUser";
import {CreateUser} from "./sceens/CreateUser";
import {LandingScreen} from "./sceens/LandingScreen";
import {MainPage} from "./sceens/MainPage";
import {ActiveProviderList} from "./sceens/ActiveProviderList";
import {EditProfile} from "./sceens/EditProfile";
import {AllProvidersList} from "./sceens/AllProvidersList";
import {ActiveAdminsList} from "./sceens/ActiveAdminsList";
import {AllAdminsList} from "./sceens/AllAdminsList";
import {CreateClinicForm} from "./sceens/CreateClinicForm";
import {MyClinicList} from "./sceens/MyClinicList";
import {EditClinicForm} from "./sceens/EditClinicForm";
import {ActiveClinicList} from "./sceens/ActiveClinicList";
import {ClinicInvites} from "./sceens/ClinicInvites";
import ExportToExelComponent from "./sceens/CSVToExcel";
import PatientDashboard from "./sceens/PatientDashboard";
import DivisionForm from "./sceens/DivisionForm";
import DivisionManagement from "./sceens/DivisionManagement";
import LegalEntityManager from "./sceens/LegalEntityManager";
import DoctorDashboardWithState from "./sceens/DoctorDashboard";
import {ConnectedUserList} from "./sceens/ConnectedUserList";
import {NotificationSystem} from "./sceens/NotificationSystem";
import {AnalyticsDashboard} from "./sceens/AnalyticsDashboard";
import {DetailedAnalytics} from "./sceens/DetailedAnalytics";
import PatientDeclarationsList from "./sceens/PatientDeclarationsList";

function App() {

  const router = createBrowserRouter([
    {
      path: '/',
      element: <LandingScreen/>
    },
    {
      path: '/login',
      element: <LoginUser/>
    },
    {
      path: '/register',
      element: <CreateUser/>
    },
    {
      path: "/signDocument",
      element: <CreateDocument />,
    },
    {
      path: "/home",
      element: <MainPage />
    },
    {
      path: "/select-providers",
      element: <ActiveProviderList />,
    },
    {
      path: "/edit-profile",
      element: <EditProfile />,
    },
    {
      path: "/all-providers",
      element: <AllProvidersList />,
    },
    {
      path: "/active-admins",
      element: <ActiveAdminsList/>,
    },
    {
      path: "/all-admins",
      element: <AllAdminsList/>,
    },
    {
      path: "/create-clinic",
      element: <CreateClinicForm/>,
    },
    {
      path: '/my-clinic-list',
      element: <MyClinicList />,
    },
    {
      path: '/edit-clinic/:id',
      element: <EditClinicForm />,
    },
    {
      path: "/active-clinic-list",
      element: <ActiveClinicList />
    },
    {
      path: '/invite-clinic/:id',
      element: <ClinicInvites />,
    },
    {
      path: "/export",
      element: <ExportToExelComponent />,
    },
    {
      path: "/patient-create-declaration",
      element: <PatientDashboard />
    },
    {
      path: "/doctor-dashboard",
      element: <DoctorDashboardWithState />
    },
    {
      path: "/division-management",
      element: <DivisionManagement />
    },
    {
      path: "/legal-entity-management",
      element: <LegalEntityManager />
    },
    {
      path: "/connected-users",
      element: <ConnectedUserList />
    },
    {
      path: '/notifications',
      element: <NotificationSystem />,
    },
    {
      path: '/analytics',
      element: <AnalyticsDashboard />,
    },
    {
      path: '/analytics/detailed',
      element: <DetailedAnalytics />,
    },
    {
      path: '/patient-declarations',
      element: <PatientDeclarationsList />,
    }
  ]);

  return (
    <>
    <RouterProvider router={router}/>
    </>
  );
}

export default App;
