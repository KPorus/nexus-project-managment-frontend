import React from 'react';
import { HashRouter, Routes, Route} from 'react-router-dom';
import Login from './pages/Login';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Login />} />
      </Routes>
    </HashRouter>
  );
};

export default App;