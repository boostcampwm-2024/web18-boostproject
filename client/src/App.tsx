import { MainPage } from '@/pages/MainPage';
import { Sidebar } from '@/widgets/sidebar';
import { StreamingPage } from './pages/StreamingPage';
function App() {
  return (
    <div className="flex flex-row">
      <Sidebar />
      <StreamingPage />
    </div>
  );
}

export default App;
