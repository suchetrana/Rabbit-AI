import Sidebar from './components/Sidebar';
import Header from './components/Header';
import UploadForm from './components/UploadForm';
import History from './components/History';
import { AppProvider, useApp } from './context/AppContext';

function AppContent() {
  const { page } = useApp();

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark">
        <Header />
        <div className="max-w-5xl mx-auto p-10">
          {page === 'dashboard' && <UploadForm />}
          {page === 'history' && <History />}
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
