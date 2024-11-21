import React from 'react';
import {CreateDocument} from "./sceens/CreateDocument";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {LoginUser} from "./sceens/LoginUser";
import {CreateUser} from "./sceens/CreateUser";
import {LandingScreen} from "./sceens/LandingScreen";

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
    }
  ]);

  return (
    <>
    <RouterProvider router={router}/>
    </>
  );
}

export default App;
