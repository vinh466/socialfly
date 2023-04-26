
import { RouterProvider } from "react-router-dom";
import router from './routes';
import Call from './components/Call';
import { Toaster } from 'react-hot-toast';

function App() {

  return (
    <div>
      <RouterProvider router={router} />
      <Call />
      <Toaster />
    </div>
  )

}

export default App
