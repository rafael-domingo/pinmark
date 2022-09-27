import './App.css';
import Locations from './components/Locations';
import Categories from './components/Categories';

function App() {
  return (
    <div className="App"> 
    <div style={{padding: 50}}>
      <div style={{display: 'flex', justifyContent: 'flex-start', flexWrap: 'wrap'}}>
          <h1 style={{width: '100%', textAlign: 'left'}}>Your Locations</h1>    
          <Locations />
        </div>
        <div style={{display: 'flex', justifyContent: 'flex-start', flexWrap: 'wrap'}}>
          <h1 style={{width: '100%', textAlign: 'left'}}>Your Categories</h1>    
          <Categories />
        </div>
    </div>
     
    </div>
  );
}

export default App;
