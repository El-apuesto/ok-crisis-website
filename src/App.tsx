import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Home } from './pages/Home';
import { Article } from './pages/Article';
import { Archives } from './pages/Archives';
import { Comics } from './pages/Comics';
import { Opinion } from './pages/Opinion';
import { Toaster } from './components/ui/sonner';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/article/:id" element={<Article />} />
            <Route path="/archives" element={<Archives />} />
            <Route path="/comics" element={<Comics />} />
            <Route path="/opinion" element={<Opinion />} />
          </Routes>
        </main>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
