import './App.css';
import NavBar from './components/navbar';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './pages/home';
import PokemonDetail from './pages/pokemondetail';
import MyProfile from './pages/myprofile';
import Authentication from './pages/authentication';

function App() {
  return (
    <Router>
      <div className="App">
        <NavBar />

        <Switch>
          <Route path="/pokemon/:id">
            <PokemonDetail />
          </Route>
          <Route path="/authentication/:action">
            <Authentication />
          </Route>
          <Route path="/my_profile">
            <MyProfile />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
