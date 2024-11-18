import React from 'react';
import {CreateDocument} from "./sceens/createDocument";
import {createBrowserRouter, RouterProvider} from "react-router-dom";

function App() {

  const router = createBrowserRouter([
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
