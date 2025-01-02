import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import './App.css';
import Upload from './pages/Upload';
import Result from './pages/Result';

function App() {
  return (
    <Router>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/upload" element={<Upload/>} />
          <Route path="/result" element={<Result />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
