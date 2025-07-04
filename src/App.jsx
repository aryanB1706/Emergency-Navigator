
import './index.css'
import { createBrowserRouter,RouterProvider } from 'react-router'
import AppLayout from './layouts/AppLayout';
import Home from './pages/Home';
import EmergencyHelp from './pages/EmergencyHelp';
import NearbyHospitals from './pages/NearbyHospitals';
import Bloodbank from './pages/Bloodbank';
import SOS from './pages/SOS';
import FirstAidCard from './components/FirstAidCard';

function App() {
  const router=createBrowserRouter([
    {
      path:"/",
      element:<AppLayout/>,
      children: [
        {
          index: true,
          element: <Home />,
        },

        {
          path: "/emergency",
          element: <EmergencyHelp />
        },
        {
          path: "/nearby-hospital",
          element: <NearbyHospitals /> 
        },
        {
          path: "/bloodbank",
          element: <Bloodbank />
        },
        {
          path: "/sos",
          element: <SOS />
        },
        {
          path: "/firstaid",
          element: <FirstAidCard />
        }
      ],
    }
  ]);
  

  return <RouterProvider router={router}/>;
}

export default App
