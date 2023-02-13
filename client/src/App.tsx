import { useState } from 'react'
import { Link, RouterProvider } from "react-router-dom";
import router from './routes';

function App() {
  const [count, setCount] = useState(0)

  return (
    <RouterProvider router={router} />
  )

}

export default App
