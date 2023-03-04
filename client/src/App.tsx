import { useEffect, useState } from 'react'
import { Link, RouterProvider } from "react-router-dom";
import router from './routes';
import { authAction } from './store/auth.slice';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import userService from './services/user.service';

function App() {
  return (
    <RouterProvider router={router} />
  )

}

export default App
