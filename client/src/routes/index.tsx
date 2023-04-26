import { createBrowserRouter, redirect } from "react-router-dom";
import Main from "@/views/layouts/Main.layout";
import None from "@/views/layouts/None.layout";
import ErrorPage from "@/views/ErrorPage";
import Chat from "@/views/chat/Chat";
import Feed from '@/views/Feed/Feed';
import Friend from '@/views/friend/Friend';
import Profile from '@/views/profile/Profile';
import Auth from "@/views/auth/Auth";
import ProtectedRoute from "@/components/ProtectedRoute";


const router = createBrowserRouter([
  {
    element: <None />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/login",
        element: <Auth />,

      },
      {
        path: "/register",
        element: <Auth />,
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
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
          {
            path: "/chat/:roomId",
            element: <Chat />,
          },
        ]
      },
    ],
  },
]);

export default router;