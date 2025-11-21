"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import { EditorToolbar } from "./EditorToolbar";
import { useEffect } from "react";
import { uploadImage } from "@/lib/storage-adapter";

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

// Custom Image extension with resize support
const ResizableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        renderHTML: attributes => {
          return {
            width: attributes.width,
          }
        },
      },
      height: {
        default: null,
        renderHTML: attributes => {
          return {
            height: attributes.height,
          }
        },
      },
    }
  },
  addNodeView() {
    return ({ node, getPos, editor }) => {
      const container = document.createElement('div');
      container.className = 'image-resizer-container';
      container.style.position = 'relative';
      container.style.display = 'inline-block';
      container.style.maxWidth = '100%';

      const img = document.createElement('img');
      img.src = node.attrs.src;
      img.className = 'max-w-full h-auto rounded-lg';
      img.style.cursor = 'pointer';

      if (node.attrs.width) {
        img.style.width = node.attrs.width + 'px';
      }
      if (node.attrs.height) {
        img.style.height = node.attrs.height + 'px';
      }

      container.appendChild(img);

      // Create border overlay
      const borderOverlay = document.createElement('div');
      borderOverlay.className = 'image-border-overlay';
      borderOverlay.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border: 3px solid #3b82f6;
        border-radius: 0.5rem;
        opacity: 0;
        transition: opacity 0.2s;
        pointer-events: none;
      `;
      container.appendChild(borderOverlay);

      // Create corner handles
      const corners = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
      const cornerHandles: { [key: string]: HTMLDivElement } = {};

      corners.forEach(corner => {
        const handle = document.createElement('div');
        handle.className = `image-resize-handle ${corner}`;

        const positions: { [key: string]: string } = {
          'top-left': 'top: -4px; left: -4px; cursor: nwse-resize;',
          'top-right': 'top: -4px; right: -4px; cursor: nesw-resize;',
          'bottom-left': 'bottom: -4px; left: -4px; cursor: nesw-resize;',
          'bottom-right': 'bottom: -4px; right: -4px; cursor: nwse-resize;',
        };

        handle.style.cssText = `
          position: absolute;
          ${positions[corner]}
          width: 8px;
          height: 8px;
          background: #3b82f6;
          border: 2px solid white;
          border-radius: 2px;
          opacity: 0;
          transition: opacity 0.2s;
          z-index: 10;
        `;

        cornerHandles[corner] = handle;
        container.appendChild(handle);
      });

      // Show border and handles on click
      let isSelected = false;

      const toggleSelection = (selected: boolean) => {
        isSelected = selected;
        borderOverlay.style.opacity = selected ? '1' : '0';
        Object.values(cornerHandles).forEach(handle => {
          handle.style.opacity = selected ? '1' : '0';
        });
      };

      // Select on click
      img.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!isSelected) {
          toggleSelection(true);
        }
      });

      // Deselect when clicking outside or pressing Escape
      const handleClickOutside = (e: MouseEvent) => {
        if (!container.contains(e.target as Node)) {
          toggleSelection(false);
        }
      };

      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && isSelected) {
          toggleSelection(false);
          editor.commands.focus();
        }
      };

      document.addEventListener('click', handleClickOutside);
      document.addEventListener('keydown', handleEscape);

      // Resize functionality
      let isResizing = false;
      let startX = 0;
      let startY = 0;
      let startWidth = 0;
      let startHeight = 0;
      let activeCorner = '';

      // Add resize listener to each corner handle
      Object.entries(cornerHandles).forEach(([corner, handle]) => {
        handle.addEventListener('mousedown', (e: MouseEvent) => {
          e.preventDefault();
          e.stopPropagation();
          isResizing = true;
          activeCorner = corner;
          startX = e.clientX;
          startY = e.clientY;
          startWidth = img.offsetWidth;
          startHeight = img.offsetHeight;

          const onMouseMove = (e: MouseEvent) => {
            if (!isResizing) return;

            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            const aspectRatio = startWidth / startHeight;

            let newWidth = startWidth;
            let newHeight = startHeight;

            // Calculate new dimensions based on which corner is being dragged
            if (activeCorner === 'bottom-right') {
              newWidth = Math.max(100, startWidth + deltaX);
              newHeight = newWidth / aspectRatio;
            } else if (activeCorner === 'bottom-left') {
              newWidth = Math.max(100, startWidth - deltaX);
              newHeight = newWidth / aspectRatio;
            } else if (activeCorner === 'top-right') {
              newWidth = Math.max(100, startWidth + deltaX);
              newHeight = newWidth / aspectRatio;
            } else if (activeCorner === 'top-left') {
              newWidth = Math.max(100, startWidth - deltaX);
              newHeight = newWidth / aspectRatio;
            }

            img.style.width = newWidth + 'px';
            img.style.height = newHeight + 'px';
          };

          const onMouseUp = () => {
            if (!isResizing) return;
            isResizing = false;

            // Update the node attributes
            const newWidth = img.offsetWidth;
            const newHeight = img.offsetHeight;

            if (typeof getPos === 'function') {
              editor.commands.updateAttributes('image', {
                width: newWidth,
                height: newHeight,
              });
            }

            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
          };

          document.addEventListener('mousemove', onMouseMove);
          document.addEventListener('mouseup', onMouseUp);
        });
      });

      return {
        dom: container,
        update: (updatedNode) => {
          if (updatedNode.type.name !== 'image') {
            return false;
          }

          img.src = updatedNode.attrs.src;

          if (updatedNode.attrs.width) {
            img.style.width = updatedNode.attrs.width + 'px';
          }
          if (updatedNode.attrs.height) {
            img.style.height = updatedNode.attrs.height + 'px';
          }

          return true;
        },
        destroy: () => {
          document.removeEventListener('click', handleClickOutside);
          document.removeEventListener('keydown', handleEscape);
        },
      };
    };
  },
});

export function Editor({ content, onChange, placeholder }: EditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder: placeholder || "Start writing your note...",
      }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight.configure({
        multicolor: true,
      }),
      ResizableImage.configure({
        inline: true,
        allowBase64: true,
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none max-w-none min-h-[400px] p-4",
      },
      handleDrop: (view, event, _slice, moved) => {
        console.log('Drop event triggered');
        // Only handle file drops, not internal moves
        if (moved) {
          console.log('Internal move detected, ignoring');
          return false;
        }

        const files = event.dataTransfer?.files;
        if (!files || files.length === 0) {
          console.log('No files in drop event');
          return false;
        }

        console.log('Files dropped:', files.length);

        // Process all dropped files
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          console.log('File type:', file.type);

          // Check if it's an image
          if (file.type.indexOf('image') === 0) {
            console.log('Image file detected in drop!');
            event.preventDefault();

            // Check file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
              alert('Image size must be less than 5MB');
              continue;
            }

            console.log('Calling uploadImage for dropped file...');
            // Upload the image
            uploadImage(file)
              .then((imageUrl) => {
                console.log('Upload complete, inserting image with URL:', imageUrl.substring(0, 50));
                // Insert image at drop position
                const { schema } = view.state;
                const coordinates = view.posAtCoords({
                  left: event.clientX,
                  top: event.clientY,
                });

                if (coordinates) {
                  const node = schema.nodes.image.create({ src: imageUrl });
                  const transaction = view.state.tr.insert(coordinates.pos, node);
                  view.dispatch(transaction);
                }
              })
              .catch((error) => {
                console.error('Failed to upload dropped image:', error);
                alert('Failed to upload image. Please try again.');
              });

            return true; // Prevent default drop behavior
          }
        }

        console.log('No image files found in drop');
        return false;
      },
      handlePaste: (view, event) => {
        console.log('Paste event triggered');
        // Handle pasted images
        const items = event.clipboardData?.items;
        if (!items) {
          console.log('No clipboard items found');
          return false;
        }

        console.log('Clipboard items:', items.length);
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          console.log('Item type:', item.type);

          // Check if it's an image
          if (item.type.indexOf('image') === 0) {
            console.log('Image detected in paste!');
            event.preventDefault();

            const file = item.getAsFile();
            if (!file) {
              console.log('Could not get file from clipboard item');
              continue;
            }

            console.log('File obtained:', file.name, file.size);

            // Check file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
              alert('Image size must be less than 5MB');
              return true;
            }

            console.log('Calling uploadImage...');
            // Upload the image
            uploadImage(file)
              .then((imageUrl) => {
                console.log('Upload complete, inserting image with URL:', imageUrl.substring(0, 50));
                // Insert image at current cursor position
                const { state } = view;
                const position = state.selection.to;

                view.dispatch(
                  state.tr.replaceWith(
                    position,
                    position,
                    state.schema.nodes.image.create({ src: imageUrl })
                  )
                );
              })
              .catch((error) => {
                console.error('Failed to upload pasted image:', error);
                alert('Failed to upload image. Please try again.');
              });

            return true; // Prevent default paste behavior
          }
        }

        console.log('No image found in paste, allowing default behavior');
        return false; // Allow default paste for non-images
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="border rounded-lg bg-background">
      <EditorToolbar editor={editor} />
      <div className="prose-editor">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
