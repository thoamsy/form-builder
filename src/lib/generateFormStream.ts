import OpenAI from "openai";
import { FormField } from "@/types/form";

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

interface MetadataLine {
  type: "metadata";
  title: string;
  description: string;
}

interface FieldLine {
  type: "field";
  fieldData: FormField;
}

type FormLine = MetadataLine | FieldLine;

function isValidFormLine(json: any): json is FormLine {
  if (!json || typeof json !== "object") return false;

  if (json.type === "metadata") {
    return typeof json.title === "string" && typeof json.description === "string";
  }

  if (json.type === "field") {
    return (
      typeof json.fieldType === "string" &&
      typeof json.label === "string" &&
      (!json.options || Array.isArray(json.options))
    );
  }

  return false;
}

export async function* generateFormStream(userDescription: string) {
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

    请严格按以下JSON Lines格式返回数据,每行必须是一个完整的JSON对象,以换行符分隔:

    {"type": "metadata", "title": "表单标题", "description": "表单描述"}
    {"type": "field", "fieldType": "text", "label": "字段1"}
    {"type": "field", "fieldType": "select", "label": "字段2", "options": ["选项1", "选项2"]}

    注意:
    1. 每行必须是一个独立完整的JSON对象
    2. 必须使用换行符分隔每个JSON对象
    3. 不要添加额外的逗号或其他分隔符
    4. 第一行必须是metadata类型
    `;

  const userPrompt = `
    这是用户的描述:

    """
    ${userDescription}
    """

    你的回答：
    `;

  const handleJSONLine = (line: string): FormLine => {
    const json = JSON.parse(line);

    if (json.type === "metadata") {
      return {
        type: "metadata",
        title: json.title,
        description: json.description,
      };
    } else if (json.type === "field") {
      const { type: _type, ...rest } = json;
      return {
        type: "field",
        fieldData: {
          ...rest,
          type: json.fieldType,
        } as FormField,
      };
    } else {
      throw new Error(`Invalid JSON line: ${line}`);
    }
  };

  const stream = await getDeepseek().chat.completions.create({
    model: "deepseek-chat",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    stream: true,
  });

  let buffer = "";
  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || "";
    buffer += content;

    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine) continue;

      try {
        yield handleJSONLine(trimmedLine);
      } catch (e) {
        console.warn("Invalid JSON line:", trimmedLine);
        console.log(e.message);
        // 可以选择记录错误但继续处理
        continue;
      }
    }
  }

  if (buffer.trim()) {
    try {
      yield handleJSONLine(buffer.trim());
    } catch {
      console.warn("Failed to parse final buffer:", buffer);
    }
  }
}
