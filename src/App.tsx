import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GlobalProvider } from './context/GlobalContext';
import { Header, Footer } from './components/Layout';
import { Home } from './pages/Home';
import { Compare } from './pages/Compare';
import { Detail } from './pages/Detail';
import { motion, AnimatePresence } from 'motion/react';
import { loadFaceModels } from './services/faceService';

export default function App() {
  useEffect(() => {
    // Pre-load face models on app start to speed up first upload
    loadFaceModels();
  }, []);

  return (
    <GlobalProvider>
      <Router>
        <div className="min-h-screen min-w-[320px] flex flex-col bg-white selection:bg-indigo-100 selection:text-indigo-900">
          <Header />
          <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/compare" element={<Compare />} />
                <Route path="/detail/:seasonId" element={<Detail />} />
              </Routes>
            </AnimatePresence>
          </main>
          <Footer />
        </div>
      </Router>
    </GlobalProvider>
  );
}
