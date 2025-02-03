import logo from './logo.svg';
import './App.css';
import { Outlet } from 'react-router-dom';
import toast, {Toaster} from 'react-hot-toast';

function App() {
  return (
    <>
    <Toaster/> {/**used to show notifications or alerts to the user*/}
      <main>
        <Outlet/>  {/**component is part of React Router. It’s a placeholder where nested routes will render their respective components. For example, if the user navigates to a specific route, the Outlet will show the component for that route inside the <main> section. */}
      </main>
    </>
    
);
}

export default App;
