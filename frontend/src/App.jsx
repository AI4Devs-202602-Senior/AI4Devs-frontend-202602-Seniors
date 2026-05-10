import React, { Suspense } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RecruiterDashboard from './components/RecruiterDashboard';
import AddCandidate from './components/AddCandidateForm';
import Positions from './components/Positions';

// Lazy-load kanban page for code splitting
const PositionPage = React.lazy(() => import('./pages/PositionPage'));

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RecruiterDashboard />} />
        <Route path="/add-candidate" element={<AddCandidate />} />
        <Route path="/positions" element={<Positions />} />
        <Route
          path="/positions/:id"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <PositionPage />
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;