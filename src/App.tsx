import React, { useState } from 'react';
import { Shell } from './components/fab-sim/Shell';
import { Overview } from './components/fab-sim/Overview';
import { Simulator } from './components/fab-sim/Simulator';
import { Invariants } from './components/fab-sim/Invariants';

export default function App() {
  const [currentPage, setCurrentPage] = useState('overview');

  const renderPage = () => {
    switch (currentPage) {
      case 'overview':
        return <Overview onStart={() => setCurrentPage('simulator')} />;
      case 'simulator':
        return <Simulator />;
      case 'invariants':
        return <Invariants />;
      default:
        return <Overview onStart={() => setCurrentPage('simulator')} />;
    }
  };

  return (
    <Shell currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderPage()}
    </Shell>
  );
}
