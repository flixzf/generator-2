import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import OrganizationTree from './generator';

const App = () => {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <OrganizationTree />
    </Router>
  );
};

export default App; 