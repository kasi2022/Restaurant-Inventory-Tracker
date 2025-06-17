import ReactDOM from 'react-dom/client';
import AppMain from './App';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter>
   <AppMain/>
  </BrowserRouter>
);
