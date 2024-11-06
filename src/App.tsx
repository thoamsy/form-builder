import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { FormBuilder } from '@/components/FormBuilder/FormBuilder';
import { FormPreview } from '@/components/FormPreview/FormPreview';
import { Button } from '@/components/ui/button';
import { useFormStore } from '@/store/formStore';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import Test from './pages/Test';

function Home() {
  const navigate = useNavigate();
  const { forms, addForm } = useFormStore();

  const handleCreateForm = () => {
    const title = `New Form ${forms.length + 1}`;
    const newForm = addForm(title);
    navigate(`/builder/${newForm.id}`);
  };

  return (
    <div className="container mx-auto">
      <div className="flex mb-6 items-center justify-between">
        <h1 className="text-3xl font-bold">My Forms</h1>
        <Button onClick={handleCreateForm}>
          <Plus className="mr-2 h-4 w-4" />
          Create New Form
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {forms.map((form) => (
          <div
            key={form.id}
            className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm"
          >
            <h2 className="text-xl font-semibold">{form.title}</h2>
            <p className="mb-4 text-sm text-muted-foreground">
              {form.description || 'No description'}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/builder/${form.id}`)}
              >
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/preview/${form.id}`)}
              >
                Preview
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="w-dvw h-dvh">
      <div className="h-screen mx-auto">
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/builder/:formId" element={<FormBuilder />} />
            <Route path="/preview/:formId" element={<FormPreview />} />
            <Route path="/test" element={<Test />} />
          </Routes>
        </Router>
      </div>
    </div>
  );
}

export default App;
