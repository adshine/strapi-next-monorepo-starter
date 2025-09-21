"use client"

import React, { ReactNode, useRef } from "react"
import {
  AlertCircle,
  FileText,
  Image as ImageIcon,
  Loader2,
  Send,
  Upload,
  X,
} from "lucide-react"

import { cn } from "@/lib/styles"
import { useComposerContext } from "@/hooks/use-composer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

// Categories for template requests
const REQUEST_CATEGORIES = [
  {
    value: "business",
    label: "Business",
    description: "Corporate websites, dashboards, landing pages",
  },
  {
    value: "ecommerce",
    label: "E-commerce",
    description: "Product catalogs, checkout flows, stores",
  },
  {
    value: "creative",
    label: "Creative",
    description: "Portfolios, galleries, personal brands",
  },
  {
    value: "blog",
    label: "Blog",
    description: "Content sites, news, magazines",
  },
  {
    value: "other",
    label: "Other",
    description: "Custom or specialized requirements",
  },
]

// Priority levels
const PRIORITY_LEVELS = [
  { value: "standard", label: "Standard", description: "2-3 weeks turnaround" },
  {
    value: "priority",
    label: "Priority",
    description: "1-2 weeks turnaround (+$50)",
  },
  { value: "rush", label: "Rush", description: "3-5 business days (+$100)" },
]

function ComposerFrame({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <Card
      className={cn(
        "bg-elevated border-border-neutral mx-auto max-w-4xl shadow-xl",
        className
      )}
    >
      {children}
    </Card>
  )
}

function ComposerHeader({
  title = "Request Custom Template",
  subtitle = "Describe your project and we'll build it for you",
}) {
  return (
    <CardHeader className="border-border-neutral border-b">
      <CardTitle className="text-text-primary text-xl">{title}</CardTitle>
      {subtitle && <p className="text-text-muted mt-1">{subtitle}</p>}
    </CardHeader>
  )
}

function ComposerTitleInput() {
  const { state, actions } = useComposerContext()

  return (
    <div className="space-y-2">
      <label htmlFor="title" className="text-text-primary text-sm font-medium">
        Project Title
      </label>
      <Input
        id="title"
        placeholder="e.g., Modern Restaurant Website"
        value={state.draft.title}
        onChange={(e) => actions.updateDraft({ title: e.target.value })}
        className="bg-elevated border-border-neutral"
      />
    </div>
  )
}

function ComposerDescriptionInput() {
  const { state, actions, meta } = useComposerContext()

  return (
    <div className="space-y-2">
      <label
        htmlFor="description"
        className="text-text-primary text-sm font-medium"
      >
        Project Description
      </label>
      <Textarea
        id="description"
        ref={meta.inputRef}
        placeholder="Describe in detail what you need..."
        value={state.draft.description}
        onChange={(e) => actions.updateDraft({ description: e.target.value })}
        rows={4}
        className="bg-elevated border-border-neutral resize-none"
      />
      <p className="text-text-muted text-xs">
        Be specific about functionality, style preferences, target devices, and
        any reference sites (minimum 100 characters)
      </p>
    </div>
  )
}

function ComposerCategorySelector() {
  const { state, actions } = useComposerContext()

  return (
    <div className="space-y-2">
      <label
        htmlFor="category"
        className="text-text-primary text-sm font-medium"
      >
        Category
      </label>
      <Select
        value={state.draft.category}
        onValueChange={(value) => actions.updateDraft({ category: value })}
      >
        <SelectTrigger className="bg-elevated border-border-neutral">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {REQUEST_CATEGORIES.map((category) => (
            <SelectItem key={category.value} value={category.value}>
              <div>
                <div className="font-medium">{category.label}</div>
                <div className="text-text-muted text-xs">
                  {category.description}
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

function ComposerPrioritySelector() {
  const { state, actions } = useComposerContext()

  return (
    <div className="space-y-2">
      <label
        htmlFor="priority"
        className="text-text-primary text-sm font-medium"
      >
        Priority Level
      </label>
      <Select
        value={state.draft.priority}
        onValueChange={(value: "standard" | "priority" | "rush") =>
          actions.updateDraft({ priority: value })
        }
      >
        <SelectTrigger className="bg-elevated border-border-neutral">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {PRIORITY_LEVELS.map((priority) => (
            <SelectItem key={priority.value} value={priority.value}>
              <div>
                <div className="font-medium">{priority.label}</div>
                <div className="text-text-muted text-xs">
                  {priority.description}
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

function ComposerAttachments() {
  const { state, actions, meta } = useComposerContext()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return

    Array.from(files).forEach((file) => {
      // Check file size
      const sizeMB = file.size / (1024 * 1024)
      if (sizeMB > meta.maxFileSize) {
        alert(
          `File "${file.name}" is too large. Maximum size is ${meta.maxFileSize}MB.`
        )
        return
      }

      // Check file type
      const isAllowedType = meta.allowedFileTypes.some((type) => {
        if (type.startsWith(".")) {
          return file.name.toLowerCase().endsWith(type)
        }
        return file.type.match(type)
      })

      if (!isAllowedType) {
        alert(`File type not supported: ${file.name}`)
        return
      }

      actions.addAttachment(file)
    })
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) {
      return <ImageIcon className="h-4 w-4" />
    }
    return <FileText className="h-4 w-4" />
  }

  const formatFileSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024)
    return mb < 1 ? `${Math.round(bytes / 1024)}KB` : `${mb.toFixed(1)}MB`
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label
          htmlFor="attachments"
          className="text-text-primary text-sm font-medium"
        >
          Attachments
        </label>
        <span className="text-text-muted text-xs">
          {state.draft.attachments.length}/{meta.maxAttachments} files
        </span>
      </div>

      {/* File list */}
      {state.draft.attachments.length > 0 && (
        <div className="space-y-2">
          {state.draft.attachments.map((file, index) => (
            <div
              key={index}
              className="bg-subtle flex items-center justify-between rounded-md p-2"
            >
              <div className="flex items-center space-x-2">
                {getFileIcon(file)}
                <div>
                  <div className="text-text-primary max-w-48 truncate text-sm font-medium">
                    {file.name}
                  </div>
                  <div className="text-text-muted text-xs">
                    {formatFileSize(file.size)}
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => actions.removeAttachment(index)}
                className="text-accent-danger hover:bg-accent-danger/10"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Upload button */}
      <Button
        type="button"
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
        disabled={state.draft.attachments.length >= meta.maxAttachments}
        className="border-border-neutral w-full border-dashed"
      >
        <Upload className="mr-2 h-4 w-4" />
        {state.draft.attachments.length >= meta.maxAttachments
          ? "Maximum attachments reached"
          : "Add reference files"}
      </Button>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={meta.allowedFileTypes.join(",")}
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
      />

      <p className="text-text-muted text-xs">
        Upload screenshots, design files, or examples. Max {meta.maxFileSize}MB
        per file.
      </p>
    </div>
  )
}

function ComposerSubmitButton({
  label = "Submit Request",
}: {
  label?: string
}) {
  const { state, actions } = useComposerContext()

  const handleSubmit = async () => {
    if (!state.draft.title.trim() || !state.draft.description.trim()) {
      alert("Please fill in both title and description")
      return
    }

    await actions.submit(state.draft)
  }

  return (
    <Button
      onClick={handleSubmit}
      disabled={state.isSubmitting}
      className="bg-accent-primary hover:bg-accent-primary/90"
    >
      {state.isSubmitting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Submitting...
        </>
      ) : (
        <>
          <Send className="mr-2 h-4 w-4" />
          {label}
        </>
      )}
    </Button>
  )
}

function ComposerError() {
  const { state } = useComposerContext()

  if (!state.error) return null

  return (
    <div className="bg-accent-danger/10 border-accent-danger/20 flex items-center space-x-2 rounded-md border p-3">
      <AlertCircle className="text-accent-danger h-4 w-4" />
      <span className="text-accent-danger text-sm">{state.error}</span>
    </div>
  )
}

function ComposerFooter({ children }: { children: ReactNode }) {
  return (
    <CardContent className="border-border-neutral border-t">
      <div className="flex items-end justify-between pt-4">
        <div className="flex-1">
          <ComposerError />
        </div>
        {children}
      </div>
    </CardContent>
  )
}

// Export the Composer namespace (compound component pattern)
export const Composer = {
  Frame: ComposerFrame,
  Header: ComposerHeader,
  TitleInput: ComposerTitleInput,
  DescriptionInput: ComposerDescriptionInput,
  CategorySelector: ComposerCategorySelector,
  PrioritySelector: ComposerPrioritySelector,
  Attachments: ComposerAttachments,
  Footer: ComposerFooter,
  Submit: ComposerSubmitButton,
  Error: ComposerError,
}
