"use client";

import { type Editor } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Highlighter,
  Image as ImageIcon,
  Table as TableIcon,
  SquareCode,
} from "lucide-react";
import { useRef, useState } from "react";
import { uploadImage } from "@/lib/storage-adapter";

interface EditorToolbarProps {
  editor: Editor;
}

export function EditorToolbar({ editor }: EditorToolbarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    try {
      setUploading(true);
      const imageUrl = await uploadImage(file);

      // Insert image into editor
      editor.chain().focus().setImage({ src: imageUrl }).run();
    } catch (error) {
      console.error('Failed to upload image:', error);
      alert('Failed to upload image. Please make sure Supabase is configured correctly.');
    } finally {
      setUploading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="sticky top-0 z-10 py-3 flex flex-wrap gap-1 bg-background">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* Text formatting */}
      <Button
        variant={editor.isActive("bold") ? "default" : "ghost"}
        size="sm"
        onClick={() => editor.chain().focus().toggleBold().run()}
        title="Bold"
        className={editor.isActive("bold") ? "bg-primary text-primary-foreground" : ""}
      >
        <Bold className="h-4 w-4" />
      </Button>

      <Button
        variant={editor.isActive("italic") ? "default" : "ghost"}
        size="sm"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        title="Italic"
        className={editor.isActive("italic") ? "bg-primary text-primary-foreground" : ""}
      >
        <Italic className="h-4 w-4" />
      </Button>

      <Button
        variant={editor.isActive("underline") ? "default" : "ghost"}
        size="sm"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        title="Underline"
        className={editor.isActive("underline") ? "bg-primary text-primary-foreground" : ""}
      >
        <UnderlineIcon className="h-4 w-4" />
      </Button>

      <Button
        variant={editor.isActive("strike") ? "default" : "ghost"}
        size="sm"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        title="Strikethrough"
        className={editor.isActive("strike") ? "bg-primary text-primary-foreground" : ""}
      >
        <Strikethrough className="h-4 w-4" />
      </Button>

      <Button
        variant={editor.isActive("highlight") ? "default" : "ghost"}
        size="sm"
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        title="Highlight"
        className={editor.isActive("highlight") ? "bg-primary text-primary-foreground" : ""}
      >
        <Highlighter className="h-4 w-4" />
      </Button>

      {/* Headings */}
      <Button
        variant={
          editor.isActive("heading", { level: 1 }) ? "default" : "ghost"
        }
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        title="Heading 1"
        className={editor.isActive("heading", { level: 1 }) ? "bg-primary text-primary-foreground" : ""}
      >
        <Heading1 className="h-4 w-4" />
      </Button>

      <Button
        variant={
          editor.isActive("heading", { level: 2 }) ? "default" : "ghost"
        }
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        title="Heading 2"
        className={editor.isActive("heading", { level: 2 }) ? "bg-primary text-primary-foreground" : ""}
      >
        <Heading2 className="h-4 w-4" />
      </Button>

      <Button
        variant={
          editor.isActive("heading", { level: 3 }) ? "default" : "ghost"
        }
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        title="Heading 3"
        className={editor.isActive("heading", { level: 3 }) ? "bg-primary text-primary-foreground" : ""}
      >
        <Heading3 className="h-4 w-4" />
      </Button>

      {/* Lists */}
      <Button
        variant={editor.isActive("bulletList") ? "default" : "ghost"}
        size="sm"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        title="Bullet List"
        className={editor.isActive("bulletList") ? "bg-primary text-primary-foreground" : ""}
      >
        <List className="h-4 w-4" />
      </Button>

      <Button
        variant={editor.isActive("orderedList") ? "default" : "ghost"}
        size="sm"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        title="Numbered List"
        className={editor.isActive("orderedList") ? "bg-primary text-primary-foreground" : ""}
      >
        <ListOrdered className="h-4 w-4" />
      </Button>

      <Button
        variant={editor.isActive("blockquote") ? "default" : "ghost"}
        size="sm"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        title="Quote"
        className={editor.isActive("blockquote") ? "bg-primary text-primary-foreground" : ""}
      >
        <Quote className="h-4 w-4" />
      </Button>

      {/* Table */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
        title="Insert Table"
      >
        <TableIcon className="h-4 w-4" />
      </Button>

      {/* Code Block */}
      <Button
        variant={editor.isActive("codeBlock") ? "default" : "ghost"}
        size="sm"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        title="Code Block"
        className={editor.isActive("codeBlock") ? "bg-primary text-primary-foreground" : ""}
      >
        <SquareCode className="h-4 w-4" />
      </Button>

      {/* Alignment */}
      <Button
        variant={
          editor.isActive({ textAlign: "left" }) ? "default" : "ghost"
        }
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        title="Align Left"
        className={editor.isActive({ textAlign: "left" }) ? "bg-primary text-primary-foreground" : ""}
      >
        <AlignLeft className="h-4 w-4" />
      </Button>

      <Button
        variant={
          editor.isActive({ textAlign: "center" }) ? "default" : "ghost"
        }
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        title="Align Center"
        className={editor.isActive({ textAlign: "center" }) ? "bg-primary text-primary-foreground" : ""}
      >
        <AlignCenter className="h-4 w-4" />
      </Button>

      <Button
        variant={
          editor.isActive({ textAlign: "right" }) ? "default" : "ghost"
        }
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        title="Align Right"
        className={editor.isActive({ textAlign: "right" }) ? "bg-primary text-primary-foreground" : ""}
      >
        <AlignRight className="h-4 w-4" />
      </Button>

      {/* Image Upload */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        title="Insert Image"
      >
        <ImageIcon className="h-4 w-4" />
      </Button>

      {/* Undo/Redo */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        title="Undo"
      >
        <Undo className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        title="Redo"
      >
        <Redo className="h-4 w-4" />
      </Button>
    </div>
  );
}
