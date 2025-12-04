import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TextAlign } from '@tiptap/extension-text-align';
import { Link } from '@tiptap/extension-link';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import {
  FiBold,
  FiItalic,
  FiUnderline,
  FiList,
  FiLink,
  FiAlignLeft,
  FiAlignCenter,
  FiAlignRight,
  FiAlignJustify,
  FiCode
} from 'react-icons/fi';

const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="border-b border-gray-300 bg-gray-50 p-2 flex flex-wrap gap-1">
      {/* Text Formatting */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded hover:bg-gray-200 transition-colors ${
          editor.isActive('bold') ? 'bg-gray-300' : ''
        }`}
        title="Bold"
      >
        <FiBold />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded hover:bg-gray-200 transition-colors ${
          editor.isActive('italic') ? 'bg-gray-300' : ''
        }`}
        title="Italic"
      >
        <FiItalic />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`p-2 rounded hover:bg-gray-200 transition-colors ${
          editor.isActive('strike') ? 'bg-gray-300' : ''
        }`}
        title="Strikethrough"
      >
        <s>S</s>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={`p-2 rounded hover:bg-gray-200 transition-colors ${
          editor.isActive('code') ? 'bg-gray-300' : ''
        }`}
        title="Code"
      >
        <FiCode />
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1"></div>

      {/* Headings */}
      <select
        onChange={(e) => {
          const level = parseInt(e.target.value);
          if (level === 0) {
            editor.chain().focus().setParagraph().run();
          } else {
            editor.chain().focus().toggleHeading({ level }).run();
          }
        }}
        className="px-2 py-1 rounded border border-gray-300 text-sm bg-white hover:bg-gray-100"
        value={
          editor.isActive('heading', { level: 1 }) ? 1 :
          editor.isActive('heading', { level: 2 }) ? 2 :
          editor.isActive('heading', { level: 3 }) ? 3 :
          editor.isActive('heading', { level: 4 }) ? 4 :
          editor.isActive('heading', { level: 5 }) ? 5 :
          editor.isActive('heading', { level: 6 }) ? 6 : 0
        }
      >
        <option value="0">Paragraph</option>
        <option value="1">Heading 1</option>
        <option value="2">Heading 2</option>
        <option value="3">Heading 3</option>
        <option value="4">Heading 4</option>
        <option value="5">Heading 5</option>
        <option value="6">Heading 6</option>
      </select>

      <div className="w-px h-6 bg-gray-300 mx-1"></div>

      {/* Lists */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded hover:bg-gray-200 transition-colors ${
          editor.isActive('bulletList') ? 'bg-gray-300' : ''
        }`}
        title="Bullet List"
      >
        <FiList />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded hover:bg-gray-200 transition-colors ${
          editor.isActive('orderedList') ? 'bg-gray-300' : ''
        }`}
        title="Numbered List"
      >
        1.
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1"></div>

      {/* Alignment */}
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        className={`p-2 rounded hover:bg-gray-200 transition-colors ${
          editor.isActive({ textAlign: 'left' }) ? 'bg-gray-300' : ''
        }`}
        title="Align Left"
      >
        <FiAlignLeft />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        className={`p-2 rounded hover:bg-gray-200 transition-colors ${
          editor.isActive({ textAlign: 'center' }) ? 'bg-gray-300' : ''
        }`}
        title="Align Center"
      >
        <FiAlignCenter />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        className={`p-2 rounded hover:bg-gray-200 transition-colors ${
          editor.isActive({ textAlign: 'right' }) ? 'bg-gray-300' : ''
        }`}
        title="Align Right"
      >
        <FiAlignRight />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
        className={`p-2 rounded hover:bg-gray-200 transition-colors ${
          editor.isActive({ textAlign: 'justify' }) ? 'bg-gray-300' : ''
        }`}
        title="Justify"
      >
        <FiAlignJustify />
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1"></div>

      {/* Link */}
      <button
        type="button"
        onClick={() => {
          const url = window.prompt('Enter URL:');
          if (url) {
            editor.chain().focus().setLink({ href: url }).run();
          }
        }}
        className={`p-2 rounded hover:bg-gray-200 transition-colors ${
          editor.isActive('link') ? 'bg-gray-300' : ''
        }`}
        title="Add Link"
      >
        <FiLink />
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1"></div>

      {/* Text Color */}
      <input
        type="color"
        onInput={(e) => editor.chain().focus().setColor(e.target.value).run()}
        className="w-8 h-8 rounded cursor-pointer"
        title="Text Color"
      />
    </div>
  );
};

const RichTextEditor = ({ value = '', onChange, placeholder = 'Enter text...' }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Link.configure({
        openOnClick: false,
      }),
      TextStyle,
      Color,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
  });

  // Update editor content when value prop changes externally
  React.useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  return (
    <div className="border border-gray-300 rounded-md overflow-hidden bg-white">
      <MenuBar editor={editor} />
      <EditorContent
        editor={editor}
        className="prose prose-sm max-w-none p-4 min-h-[200px] focus:outline-none"
        placeholder={placeholder}
      />
      <style>{`
        .ProseMirror {
          outline: none;
        }
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #9ca3af;
          pointer-events: none;
          height: 0;
        }
        .ProseMirror h1 {
          font-size: 2em;
          font-weight: bold;
          margin-top: 0.67em;
          margin-bottom: 0.67em;
        }
        .ProseMirror h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin-top: 0.83em;
          margin-bottom: 0.83em;
        }
        .ProseMirror h3 {
          font-size: 1.17em;
          font-weight: bold;
          margin-top: 1em;
          margin-bottom: 1em;
        }
        .ProseMirror h4 {
          font-size: 1em;
          font-weight: bold;
          margin-top: 1.33em;
          margin-bottom: 1.33em;
        }
        .ProseMirror h5 {
          font-size: 0.83em;
          font-weight: bold;
          margin-top: 1.67em;
          margin-bottom: 1.67em;
        }
        .ProseMirror h6 {
          font-size: 0.67em;
          font-weight: bold;
          margin-top: 2.33em;
          margin-bottom: 2.33em;
        }
        .ProseMirror ul, .ProseMirror ol {
          padding-left: 1.5em;
          margin: 1em 0;
        }
        .ProseMirror li {
          margin: 0.25em 0;
        }
        .ProseMirror code {
          background-color: #f3f4f6;
          padding: 0.2em 0.4em;
          border-radius: 0.25em;
          font-family: monospace;
        }
        .ProseMirror a {
          color: #3b82f6;
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
