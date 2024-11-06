import { MainPage } from '@/pages/MainPage';
import { Sidebar } from '@/widgets/sidebar';
function App() {
  return (
    <div className="flex flex-row">
      <Sidebar />
      <MainPage />
    </div>
  );
}

export default App;
