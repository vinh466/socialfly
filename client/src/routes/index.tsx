import { createBrowserRouter } from "react-router-dom";
import Main from "@/views/layouts/Main.layout";
import None from "@/views/layouts/None.layout";
import ErrorPage from "@/views/ErrorPage";
import Chat from "@/views/Chat";
import Feed from '@/views/Feed';
import Friend from '@/views/Friend';
import Profile from '@/views/Profile';
import Login from "@/views/auth/Login";
import Register from "@/views/auth/Register";


const router = createBrowserRouter([
  {
    element: <None />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
    ],
  },
  {
    element: <Main />,
    children: [
      {
        path: "/",
        element: <Feed />,
      },
      {
        path: "/feed",
        element: <Feed />,
      },
      {
        path: "/friend",
        element: <Friend />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/chat",
        element: <Chat />,
      },
    ],
  },
]);

export default router;