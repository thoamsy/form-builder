import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useFormStore } from "@/store/formStore";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { FormField } from "@/types/form";
import OpenAI from "openai";

let deepSeek: OpenAI | null = null;
const getDeepseek = () => {
  if (!deepSeek) {
    deepSeek = new OpenAI({
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true,
      baseURL: "https://api.deepseek.com",
    });
  }
  return deepSeek;
};

const generateFormDescription = async (
  userDescription: string,
): Promise<{
  title: string;
  description?: string;
  reason?: string;
  fields: FormField[];
}> => {
  const systemPrompt = `
  你是一个非常专业的 form builder，我会提供你一些我们目前支持的 Form fields，它由 JSON 来描述。接下来用户会描述他们的需求，你需要从我提供给你的几个 支持的 fields 中找出最符合他们需求的 form 的 JSON，接着我会用这个 JSON 来渲染 UI。如果你不知道如何处理用户的需求，比如用户说了一些和我们场景无关的需求，你就返回一个空的 \`[]\`

  下面是一个我们包含了所有 fields 的完整 JSON。

  \`\`\`
  [
      {
          "type": "number",
          "label": "Number Input",
          "required": false,
          "placeholder": "Enter number...",
          "step": 1,
          "id": "f5bfa7c3-f208-42d2-aca0-7b55957611b8"
      },
      {
          "type": "select",
          "label": "Select Input",
          "required": false,
          "placeholder": "Select an option...",
          "options": [
              {
                  "value": "option1",
                  "label": "Option 1"
              }
          ],
          "id": "df12a075-9128-440c-bdfd-6eb4c126407a"
      },
      {
          "type": "text",
          "label": "Text Input",
          "required": false,
          "placeholder": "Enter text...",
          "id": "f3e26cac-4f52-4d7f-b5bd-aab40fe36a4a"
      },
      {
          "type": "checkbox",
          "label": "Checkbox",
          "required": false,
          "defaultChecked": false,
          "id": "18bf9b68-6a4f-40e9-8659-4e5ede227fb9"
      },
      {
          "type": "date",
          "label": "Date Picker",
          "required": false,
          "rangeMode": false,
          "placeholder": "Pick a date...",
          "id": "52b0d0c5-a19f-4533-8f85-d3ab66c79f38"
      },
      {
          "type": "radio",
          "label": "Radio Group",
          "required": false,
          "options": [
              {
                  "value": "radio1",
                  "label": "Radio 1"
              }
          ],
          "layout": "vertical",
          "id": "ce297da8-3373-44f5-8faa-47d0eeab5ebd"
      },
      {
          "type": "textarea",
          "label": "Long Text",
          "required": false,
          "placeholder": "Enter text...",
          "rows": 4,
          "id": "90cf82c1-7271-4094-89a2-98c57cb88a44"
      }
  ]
  \`\`\`

  所有的 fields 都需要 ID（这个请通过 UUID v4 生成），placeholder（这个可以留空），label 和 description（基于用户的描述自动填充，如果你无法识别就留空）
  1. TextInput, 支持指定 minimumLength, maximumLength
  2. Number Input, 支持 miniMumValue & maximumValue & step
  3. Select, 用户可以描述支持的 options [             {                 "value": "radio1",                 "label": "Radio 1”             }], 但是注意我们的 selection 不支持多选
  4. checkbox，可以配置是否默认 check
  5. Radio Group, 和 selection 类似
  6. Long Text，和 TextInput 类似，不过更适用于需要大段文字的场景，比如描述你的想法或者建议
  7. Date Picker，让用户选择一个具体的日期。支持禁用过去的时间, \`disabledPastDates\`. 支持选择一个 date range: \`rangeMode\`.

  当你基于用户的描述创建好 JSON 后，请在基于给用户的 form 取一个简短的名字，并作为 title 这个字段返回。这个 title 最好不超过 12 个中文或者 6 个英文单词。如果实在需要额外的解释，可以放在一个 description 字段里进一步阐述。
  `;

  const userPrompt = `
  这是用户的描述:

  """
  ${userDescription}
  """

  请你基于下面这个 JSON 描述来返回结果，记住只需要返回 JSON，不要返回其他的。
  \`\`\`
  { "form": yourForm, "title": "",  "description": "", "reason": ""}
  \`\`\`

  你的回答：
  `;

  const rep = await getDeepseek().chat.completions.create({
    model: "deepseek-chat",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    response_format: { type: "json_object" },
  });

  if (rep.choices[0].message.content) {
    const { title, description, reason, form } = JSON.parse(rep.choices[0].message.content);

    return {
      title,
      description,
      reason,
      fields: form,
    };
  } else {
    throw new Error("failed to generate form");
  }
};

export function AIFormGenerator() {
  const [description, setDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { addForm, addFields } = useFormStore();

  const handleGenerate = async () => {
    if (!description.trim()) {
      toast.error("Please provide a description for your form");
      return;
    }

    setIsGenerating(true);
    try {
      const { title, fields, description: formDescription } = await generateFormDescription(description);

      const newForm = addForm(title, formDescription);
      addFields(newForm.id, fields);

      toast.success("Form generated successfully!");
      setIsOpen(false);
      navigate(`/builder/${newForm.id}`);
    } catch (error) {
      console.log(error);
      toast.error("Failed to generate form. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

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
