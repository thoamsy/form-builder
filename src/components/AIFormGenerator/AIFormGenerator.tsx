import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useFormStore } from "@/store/formStore";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { generateFormStream } from "@/lib/generateFormStream";

export function AIFormGenerator() {
  const [description, setDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { addForm, addField } = useFormStore();
  const generationStateRef = useRef<{
    formId?: string;
    shouldNavigate: boolean;
  }>({ shouldNavigate: false });

  const handleGenerate = async () => {
    if (!description.trim()) {
      toast.error("Please provide a description for your form");
      return;
    }

    setIsGenerating(true);
    generationStateRef.current = { shouldNavigate: true };
    try {
      const stream = generateFormStream(description);
      const reader = stream.getReader();
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        console.log(value);

        if (value.type === "metadata") {
          const form = addForm(value.title, value.description);
          generationStateRef.current.formId = form.id;

          // 如果组件已经卸载，不执行导航
          if (generationStateRef.current.shouldNavigate) {
            navigate(`/builder/${form.id}`);
          }
        } else if (value.type === "field" && generationStateRef.current.formId) {
          addField(generationStateRef.current.formId, value.fieldData);
        }
      }

      toast.success("Form generated successfully!");
      setIsOpen(false);
    } catch (error) {
      console.log(error);
      toast.error("Failed to generate form. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    return () => {
      generationStateRef.current.shouldNavigate = false;
    };
  }, []);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button>
          <Sparkles className="mr-2 h-4 w-4" />
          Create by AI
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px]" align="end">
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-medium leading-none">Generate Form with AI</h3>
            <p className="text-sm text-muted-foreground">
              Describe your form requirements and we'll generate it for you.
            </p>
          </div>
          <Textarea
            className="min-h-[100px] resize-none"
            placeholder="Example: Create a contact form with fields for name, email, phone number, and a message box. The name and email should be required fields."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="flex justify-end space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsOpen(false);
                setDescription("");
              }}
            >
              Cancel
            </Button>
            <Button size="sm" onClick={handleGenerate} disabled={isGenerating || !description}>
              {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isGenerating ? "Generating..." : "Generate Form"}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
