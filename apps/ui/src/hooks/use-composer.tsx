"use client"

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react"

// Types for the composer
export interface TemplateRequestDraft {
  title: string
  description: string
  category: string
  priority: "standard" | "priority" | "rush"
  attachments: File[]
  budget?: string
  timeline?: string
}

export interface ComposerState {
  isOpen: boolean
  isSubmitting: boolean
  draft: TemplateRequestDraft
  error?: string
}

export interface ComposerActions {
  open: () => void
  close: () => void
  submit: (request: TemplateRequestDraft) => Promise<void> // eslint-disable-line @typescript-eslint/no-unused-vars
  updateDraft: (updates: Partial<TemplateRequestDraft>) => void // eslint-disable-line @typescript-eslint/no-unused-vars
  addAttachment: (file: File) => void // eslint-disable-line @typescript-eslint/no-unused-vars
  removeAttachment: (index: number) => void // eslint-disable-line @typescript-eslint/no-unused-vars
  clearDraft: () => void
}

export interface ComposerMeta {
  inputRef: React.MutableRefObject<HTMLTextAreaElement | null>
  maxAttachments: number
  maxFileSize: number // in MB
  allowedFileTypes: string[]
}

export interface ComposerContextValue {
  state: ComposerState
  actions: ComposerActions
  meta: ComposerMeta
}

// Default values
const DEFAULT_DRAFT: TemplateRequestDraft = {
  title: "",
  description: "",
  category: "business",
  priority: "standard",
  attachments: [],
}

const DEFAULT_STATE: ComposerState = {
  isOpen: false,
  isSubmitting: false,
  draft: DEFAULT_DRAFT,
}

const DEFAULT_ACTIONS: ComposerActions = {
  open: () => {},
  close: () => {},
  submit: async () => {},
  updateDraft: () => {},
  addAttachment: () => {},
  removeAttachment: () => {},
  clearDraft: () => {},
}

const DEFAULT_META: ComposerMeta = {
  inputRef: { current: null },
  maxAttachments: 5,
  maxFileSize: 10,
  allowedFileTypes: ["image/*", "application/pdf", ".doc", ".docx", ".txt"],
}

const ComposerContext = createContext<ComposerContextValue>({
  state: DEFAULT_STATE,
  actions: DEFAULT_ACTIONS,
  meta: DEFAULT_META,
})

export function useComposerContext() {
  const context = useContext(ComposerContext)
  if (!context) {
    throw new Error(
      "Composer components must be used within a ComposerProvider"
    )
  }
  return context
}

interface ComposerProviderProps {
  children: ReactNode
  onSubmit?: (request: TemplateRequestDraft) => Promise<void>
}

// Custom hook for composer state management
export function useComposerState(
  onSubmit?: (request: TemplateRequestDraft) => Promise<void> // eslint-disable-line @typescript-eslint/no-unused-vars
) {
  const [state, setState] = useState<ComposerState>(DEFAULT_STATE)
  const inputRef = useRef<HTMLTextAreaElement | null>(null)

  const actions: ComposerActions = {
    open: useCallback(() => {
      setState((prev) => ({ ...prev, isOpen: true }))
    }, []),

    close: useCallback(() => {
      setState((prev) => ({
        ...prev,
        isOpen: false,
        draft: DEFAULT_DRAFT, // Reset draft when closing
        error: undefined,
      }))
    }, []),

    submit: useCallback(
      async (request: TemplateRequestDraft) => {
        setState((prev) => ({ ...prev, isSubmitting: true, error: undefined }))

        try {
          if (onSubmit) {
            await onSubmit(request)
          }

          // Reset state on success
          setState(DEFAULT_STATE)

          // Could trigger a success toast/notification here
          // eslint-disable-next-line no-console
          console.log("Template request submitted successfully:", request)
        } catch (error) {
          setState((prev) => ({
            ...prev,
            isSubmitting: false,
            error: error instanceof Error ? error.message : "Submission failed",
          }))
        }
      },
      [onSubmit]
    ),

    updateDraft: useCallback((updates: Partial<TemplateRequestDraft>) => {
      setState((prev) => ({
        ...prev,
        draft: { ...prev.draft, ...updates },
      }))
    }, []),

    addAttachment: useCallback((file: File) => {
      setState((prev) => {
        const newAttachments = [...prev.draft.attachments, file]
        return {
          ...prev,
          draft: { ...prev.draft, attachments: newAttachments },
        }
      })
    }, []),

    removeAttachment: useCallback((index: number) => {
      setState((prev) => {
        const newAttachments = prev.draft.attachments.filter(
          (_, i) => i !== index
        )
        return {
          ...prev,
          draft: { ...prev.draft, attachments: newAttachments },
        }
      })
    }, []),

    clearDraft: useCallback(() => {
      setState((prev) => ({
        ...prev,
        draft: DEFAULT_DRAFT,
        error: undefined,
      }))
    }, []),
  }

  const meta: ComposerMeta = {
    inputRef,
    maxAttachments: DEFAULT_META.maxAttachments,
    maxFileSize: DEFAULT_META.maxFileSize,
    allowedFileTypes: DEFAULT_META.allowedFileTypes,
  }

  return { state, actions, meta }
}

export function ComposerProvider({
  children,
  onSubmit,
}: ComposerProviderProps) {
  const composer = useComposerState(onSubmit)

  return (
    <ComposerContext.Provider value={composer}>
      {children}
    </ComposerContext.Provider>
  )
}
