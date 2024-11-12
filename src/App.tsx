import { BrowserRouter as Router, Routes, Route, Outlet, Link } from "react-router-dom";
import { FormPreview } from "@/components/FormPreview/FormPreview";
import { Button } from "@/components/ui/button";
import { useFormStore } from "@/store/formStore";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import Test from "./pages/Test";
import { Toaster } from "sonner";
import { DrawerLayout } from "./DrawerLayout";
import { AIFormGenerator } from "./components/AIFormGenerator/AIFormGenerator";
import { FormBuilder } from "./components/FormBuilder/FormBuilder";

function Home() {
  const navigate = useNavigate();
  const { forms, addForm, deleteForm } = useFormStore();

  const handleCreateForm = () => {
    const title = `New Form ${forms.length + 1}`;
    const newForm = addForm(title);
    navigate(`/builder/${newForm.id}`);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Forms</h1>
        <menu className="space-x-2">
          <AIFormGenerator />

          <Button variant="outline" onClick={handleCreateForm}>
            <Plus className="mr-2 h-4 w-4" />
            Create by hand
          </Button>
        </menu>
      </div>
      <Outlet />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {forms.map((form) => (
          <div key={form.id} className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
            <h2 className="text-xl font-semibold">{form.title}</h2>
            <p className="mb-4 text-sm text-muted-foreground">{form.description || "No description"}</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => navigate(`/builder/${form.id}`)}>
                Edit
              </Button>
              <Button variant="outline" size="sm">
                <Link to={`/${form.id}/preview`}>Preview</Link>
              </Button>
              <Button
                onClick={() => {
                  deleteForm(form.id);
                }}
                className="ml-auto"
                variant="destructive"
                size="sm"
              >
                Delete
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
    <div className="h-dvh w-dvw">
      <Toaster />
      <div className="mx-auto h-screen">
        <Router>
          <Routes>
            <Route element={<DrawerLayout />}>
              <Route path="/" element={<Home />}>
                <Route path=":formId/preview" element={<FormPreview />} />
              </Route>

              <Route path="builder/:formId" element={<FormBuilder />}>
                <Route path="preview" element={<FormPreview />} />
              </Route>
            </Route>
            <Route path="/test" element={<Test />} />
          </Routes>
        </Router>
      </div>
    </div>
  );
}

export default App;
