import './App.css';
import { Routes, Route, Link } from 'react-router-dom';
import PinmarkList from './pages/PinmarkList';
import UserHome from './pages/UserHome';
import PinmarkDetail from './pages/PinmarkDetail';
import SignIn from './pages/SignIn';

function App() {
  return (
    <div className="App"> 
    <div style={{padding: 50}}>
      <Routes>
        <Route path="/" element={<SignIn />}/>
        <Route path="/UserHome" element={<UserHome />}/>
        <Route path="/PinmarkList" element={<PinmarkList />}/>
        <Route path="/PinmarkDetail" element={<PinmarkDetail/>}/>
      </Routes>
    </div>
     
    </div>
  );
}

export default App;
