# 🚀 Feature Implementation Plan: Templates & AI Importer

## 🧠 Core Philosophy
Reduce the "Time to Value" for new users. A user should have a beautiful, populated menu within **60 seconds** of signing up, either by cloning a template or uploading their existing file.

---

## 🎨 Feature 1: Template Marketplace

### 1. Database Schema Changes
We will leverage the existing structure by marking specific venues as "Templates".

```sql
-- Add template fields to venues
ALTER TABLE venues 
ADD COLUMN is_template BOOLEAN DEFAULT false,
ADD COLUMN template_category TEXT, -- 'Cafe', 'Fine Dining', 'Bar', 'Fast Food'
ADD COLUMN template_tags TEXT[], -- ['dark', 'minimal', 'photos']
ADD COLUMN preview_image_url TEXT;

-- Index for fast filtering
CREATE INDEX idx_venues_template ON venues(is_template, template_category);
```

### 2. The "Deep Clone" Function (Critical)
We need a robust database function to clone a menu hierarchy efficiently.

```sql
CREATE OR REPLACE FUNCTION clone_venue_from_template(
  template_id UUID,
  new_owner_id UUID,
  new_name TEXT
) RETURNS UUID AS $$
DECLARE
  new_venue_id UUID;
BEGIN
  -- 1. Copy Venue
  INSERT INTO venues (name, slug, type, owner_id, theme_settings)
  SELECT 
    new_name, 
    slug || '-' || uuid_generate_v4(), -- Temporary safe slug
    type, 
    new_owner_id, 
    theme_settings
  FROM venues WHERE id = template_id
  RETURNING id INTO new_venue_id;

  -- 2. Copy Sections, Categories, Items (Recursive CTE or Loop)
  -- (Implementation detail: Iterate through sections, then categories, then items to maintain hierarchy)
  
  RETURN new_venue_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 3. UI/UX: The Marketplace
*   **Location:** `/create-menu` or `/templates`.
*   **Components:**
    *   `TemplateCard`: Shows preview image, category badge, and "Use Template" button.
    *   `CategoryFilter`: Pill tabs for industry types.
    *   `PreviewModal`: Full screen preview of the template before cloning.

---

## 🤖 Feature 2: AI Menu Importer (PDF/Excel -> Data)

### 1. The Workflow
1.  **Drag & Drop:** User drops a PDF or Image of their menu.
2.  **Edge Function:** File is sent to `supabase/functions/parse-menu`.
3.  **AI Vision Processing:** The function uses GPT-4o (Vision) to "look" at the menu.
    *   *System Prompt:* "You are a data extraction engine. Extract the menu structure into this JSON format: `{ sections: [{ name, categories: [{ name, items: [{ name, description, price }] }] }] }`."
4.  **Review Step:** Frontend displays a specialized "Menu Editor Grid" populated with the JSON.
5.  **Finalize:** User clicks "Create Menu" -> Client loops through the JSON and calls Supabase `insert` to save to DB.

### 2. Edge Function Usage (Pseudo-code)
```typescript
// supabase/functions/parse-menu/index.ts
serve(async (req) => {
  const { fileUrl } = await req.json();
  
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: "Extract menu data to JSON..." },
      { role: "user", content: [
        { type: "image_url", image_url: { url: fileUrl } } 
      ]}
    ]
  });

  return new Response(response.choices[0].message.content);
});
```

---

## 📅 Roadmap & Next Steps

### Step 1: Foundation (Templates)
1. [ ] Run SQL migration to add `is_template` columns.
2. [ ] Write the `clone_venue_from_template` PL/pgSQL function.
3. [ ] Create one "Master Template" manually in the admin dashboard to test.

### Step 2: Marketplace UI
1. [ ] Build `TemplateMarketplace` page.
2. [ ] Connect "Use Template" button to the clone function.

### Step 3: AI Importer
1. [ ] Create Supabase Bucket `imports`.
2. [ ] Build basic UI for File Upload.
3. [ ] (Complex) Set up Edge Function with OpenAI/Gemini API key.

## 💡 Recommendation
Start with **Step 1 (Templates Foundation)**. It's purely SQL and backend logic, low risk, and sets up the stricture for everything else.
