import { Link, NavLink, Route, Routes } from 'react-router-dom';

import Home from './pages/Home.jsx';
import Progress from './pages/Progress.jsx';
import Reflection from './pages/Reflection.jsx';
import Scenario from './pages/Scenario.jsx';
import TextReview from './pages/TextReview.jsx';

function Masthead() {
  return (
    <header className="masthead">
      <div className="masthead-inner">
        <Link to="/" className="masthead-brand">
          Carnegie Coach
        </Link>
        <NavLink to="/voortgang" className="masthead-link">
          Voortgang
        </NavLink>
      </div>
    </header>
  );
}

function NotFound() {
  return (
    <main className="page stack">
      <h1 className="title">Deze pagina bestaat niet</h1>
      <p className="subtitle">Ga terug naar het startscherm om te oefenen.</p>
      <Link to="/" className="btn btn-block">
        Naar start
      </Link>
    </main>
  );
}

export default function App() {
  return (
    <div className="app">
      <Masthead />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/oefenen" element={<Scenario />} />
        <Route path="/tekst" element={<TextReview />} />
        <Route path="/reflectie" element={<Reflection />} />
        <Route path="/voortgang" element={<Progress />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
