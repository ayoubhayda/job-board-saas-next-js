"use client";

import React from "react";
import { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link,
  Undo,
  Redo,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface MenuBarProps {
  editor: Editor | null;
}

const MenuBar = ({ editor }: MenuBarProps) => {
  if (!editor) {
    return null;
  }

  const setLink = () => {
    const url = window.prompt("Enter the URL");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <div className="border-b border-border rounded-t-lg p-2 bg-card flex flex-wrap gap-1 items-center">
      <TooltipProvider>
        <div className="flex flex-wrap gap-1">
          <Tooltip>
            <TooltipTrigger asChild className="!cursor-pointer">
              <Toggle
                size="sm"
                pressed={editor.isActive("bold")}
                onPressedChange={() =>
                  editor.chain().focus().toggleBold().run()
                }
                className={cn(
                  editor.isActive("bold") && "bg-muted text-muted-foreground !cursor-pointer"
                )}
              >
                <Bold className="h-4 w-4" />
              </Toggle>
            </TooltipTrigger> 
            <TooltipContent className="text-white" >Bold</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild className="!cursor-pointer">
              <Toggle
                size="sm"
                pressed={editor.isActive("italic")}
                onPressedChange={() =>
                  editor.chain().focus().toggleItalic().run()
                }
                className={cn(
                  editor.isActive("italic") && "bg-muted text-muted-foreground !cursor-pointer"
                )}
              >
                <Italic className="h-4 w-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent className="text-white" >Italic</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild className="!cursor-pointer">
              <Toggle
                size="sm"
                pressed={editor.isActive("strike")}
                onPressedChange={() =>
                  editor.chain().focus().toggleStrike().run()
                }
                className={cn(
                  editor.isActive("strike") && "bg-muted text-muted-foreground !cursor-pointer"
                )}
              >
                <Strikethrough className="h-4 w-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent className="text-white" >Strikethrough</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild className="!cursor-pointer">
              <Toggle
                size="sm"
                pressed={editor.isActive("code")}
                onPressedChange={() =>
                  editor.chain().focus().toggleCode().run()
                }
                className={cn(
                  editor.isActive("code") && "bg-muted text-muted-foreground !cursor-pointer"
                )}
              >
                <Code className="h-4 w-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent className="text-white" >Code</TooltipContent>
          </Tooltip>
        </div>

        <div className="w-px h-6 bg-border mx-2" />

        <div className="flex flex-wrap gap-1">
          <Tooltip>
            <TooltipTrigger asChild className="!cursor-pointer">
              <Toggle
                size="sm"
                pressed={editor.isActive("heading", { level: 1 })}
                onPressedChange={() =>
                  editor.chain().focus().toggleHeading({ level: 1 }).run()
                }
                className={cn(
                  editor.isActive("heading", { level: 1 }) &&
                    "bg-muted text-muted-foreground !cursor-pointer"
                )}
              >
                <Heading1 className="h-4 w-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent className="text-white" >Heading 1</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild className="!cursor-pointer">
              <Toggle
                size="sm"
                pressed={editor.isActive("heading", { level: 2 })}
                onPressedChange={() =>
                  editor.chain().focus().toggleHeading({ level: 2 }).run()
                }
                className={cn(
                  editor.isActive("heading", { level: 2 }) &&
                    "bg-muted text-muted-foreground !cursor-pointer"
                )}
              >
                <Heading2 className="h-4 w-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent className="text-white" >Heading 2</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild className="!cursor-pointer">
              <Toggle
                size="sm"
                pressed={editor.isActive("heading", { level: 3 })}
                onPressedChange={() =>
                  editor.chain().focus().toggleHeading({ level: 3 }).run()
                }
                className={cn(
                  editor.isActive("heading", { level: 3 }) &&
                    "bg-muted text-muted-foreground !cursor-pointer"
                )}
              >
                <Heading3 className="h-4 w-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent className="text-white" >Heading 3</TooltipContent>
          </Tooltip>
        </div>

        <div className="w-px h-6 bg-border mx-2" />

        <div className="flex flex-wrap gap-1">
          <Tooltip>
            <TooltipTrigger asChild className="!cursor-pointer">
              <Toggle
                size="sm"
                pressed={editor.isActive("bulletList")}
                onPressedChange={() =>
                  editor.chain().focus().toggleBulletList().run()
                }
                className={cn(
                  editor.isActive("bulletList") &&
                    "bg-muted text-muted-foreground !cursor-pointer"
                )}
              >
                <List className="h-4 w-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent className="text-white" >Bullet List</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild className="!cursor-pointer">
              <Toggle
                size="sm"
                pressed={editor.isActive("orderedList")}
                onPressedChange={() =>
                  editor.chain().focus().toggleOrderedList().run()
                }
                className={cn(
                  editor.isActive("orderedList") &&
                    "bg-muted text-muted-foreground !cursor-pointer"
                )}
              >
                <ListOrdered className="h-4 w-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent className="text-white" >Ordered List</TooltipContent>
          </Tooltip>
        </div>

        <div className="w-px h-6 bg-border mx-2" />

        <div className="flex flex-wrap gap-1">
          <Tooltip>
            <TooltipTrigger asChild className="!cursor-pointer">
              <Toggle
                size="sm"
                pressed={editor.isActive({ textAlign: "left" })}
                onPressedChange={() =>
                  editor.chain().focus().setTextAlign("left").run()
                }
                className={cn(
                  editor.isActive({ textAlign: "left" }) &&
                    "bg-muted text-muted-foreground !cursor-pointer"
                )}
              >
                <AlignLeft className="h-4 w-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent className="text-white" >Align Left</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild className="!cursor-pointer">
              <Toggle
                size="sm"
                pressed={editor.isActive({ textAlign: "center" })}
                onPressedChange={() =>
                  editor.chain().focus().setTextAlign("center").run()
                }
                className={cn(
                  editor.isActive({ textAlign: "center" }) &&
                    "bg-muted text-muted-foreground !cursor-pointer"
                )}
              >
                <AlignCenter className="h-4 w-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent className="text-white" >Align Center</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild className="!cursor-pointer">
              <Toggle
                size="sm"
                pressed={editor.isActive({ textAlign: "right" })}
                onPressedChange={() =>
                  editor.chain().focus().setTextAlign("right").run()
                }
                className={cn(
                  editor.isActive({ textAlign: "right" }) &&
                    "bg-muted text-muted-foreground !cursor-pointer"
                )}
              >
                <AlignRight className="h-4 w-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent className="text-white" >Align Right</TooltipContent>
          </Tooltip>
        </div>

        <div className="w-px h-6 bg-border mx-2" />

        <div className="flex flex-wrap gap-1">
          <Tooltip>
            <TooltipTrigger asChild className="!cursor-pointer">
              <Button
                size="sm"
                type="button"
                variant={editor.isActive("link") ? "secondary" : "ghost"}
                onClick={setLink}
                className={cn(
                  editor.isActive("link") && "bg-muted text-muted-foreground !cursor-pointer"
                )}
              >
                <Link className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="text-white" >Add Link</TooltipContent>
          </Tooltip>
        </div>

        <div className="w-px h-6 bg-border mx-2" />

        <div className="flex flex-wrap gap-1">
          <Tooltip>
            <TooltipTrigger asChild className="!cursor-pointer">
              <Button
                size="sm"
                variant="ghost"
                type="button"
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
              >
                <Undo className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="text-white" >Undo</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild className="!cursor-pointer">
              <Button
                size="sm"
                type="button"
                variant="ghost"
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
              >
                <Redo className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="text-white" >Redo</TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </div>
  );
};

export default MenuBar;
