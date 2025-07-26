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
  ]);

  return (
    <>
    <RouterProvider router={router}/>
    </>
  );
}

export default App;
