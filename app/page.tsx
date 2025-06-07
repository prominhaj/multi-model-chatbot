"use client"

import type React from "react"
import { useChat } from "ai/react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Bot,
  User,
  Copy,
  Check,
  RotateCcw,
  Send,
  Zap,
  BrainCircuit,
  MessageSquare,
  Globe,
  Sparkles,
  Settings,
} from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

const AI_MODELS = [
  {
    id: "deepseek/deepseek-r1-0528:free",
    name: "DeepSeek R1",
    description: "Advanced reasoning model",
    category: "Reasoning",
    icon: BrainCircuit,
  },
  {
    id: "google/gemini-2.0-flash-exp:free",
    name: "Gemini 2.0 Flash",
    description: "Fast multimodal model",
    category: "Multimodal",
    icon: Sparkles,
  },
  {
    id: "meta-llama/llama-3.3-8b-instruct:free",
    name: "Llama 3.3 8B",
    description: "Meta's instruction-tuned model",
    category: "General",
    icon: MessageSquare,
  },
  {
    id: "microsoft/phi-4-reasoning-plus:free",
    name: "Phi-4 Reasoning+",
    description: "Microsoft's reasoning model",
    category: "Reasoning",
    icon: BrainCircuit,
  },
  {
    id: "qwen/qwen3-235b-a22b:free",
    name: "Qwen 3 235B",
    description: "Large parameter model",
    category: "General",
    icon: Zap,
  },
  {
    id: "google/gemma-3n-e4b-it:free",
    name: "Gemma 3N",
    description: "Google's efficient model",
    category: "General",
    icon: MessageSquare,
  },
  {
    id: "deepseek/deepseek-v3-base:free",
    name: "DeepSeek V3",
    description: "Versatile base model",
    category: "General",
    icon: Bot,
  },
  {
    id: "sarvamai/sarvam-m:free",
    name: "Sarvam M",
    description: "Multilingual model",
    category: "Multilingual",
    icon: Globe,
  },
]

const CodeBlock = ({ language, children }: { language: string; children: string }) => {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(children)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative group my-3">
      <div className="flex items-center justify-between bg-gray-900 px-3 py-2 rounded-t-lg">
        <span className="text-xs text-gray-300 font-mono">{language}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={copyToClipboard}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-300 hover:text-white h-6 w-6 p-0"
        >
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
        </Button>
      </div>
      <pre className="bg-gray-950 text-gray-100 p-3 rounded-b-lg overflow-x-auto text-sm">
        <code className="font-mono leading-relaxed">{children}</code>
      </pre>
    </div>
  )
}

const MessageContent = ({ content }: { content: string }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ node, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "")
          const language = match ? match[1] : ""

          if (language) {
            return <CodeBlock language={language}>{String(children).replace(/\n$/, "")}</CodeBlock>
          }

          return (
            <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
              {children}
            </code>
          )
        },
        ul({ children }) {
          return <ul className="list-disc list-inside space-y-1 my-2">{children}</ul>
        },
        ol({ children }) {
          return <ol className="list-decimal list-inside space-y-1 my-2">{children}</ol>
        },
        blockquote({ children }) {
          return (
            <blockquote className="border-l-4 border-blue-500 pl-3 italic my-2 text-gray-600 dark:text-gray-400">
              {children}
            </blockquote>
          )
        },
        table({ children }) {
          return (
            <div className="overflow-x-auto my-3">
              <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-600 rounded-lg text-sm">
                {children}
              </table>
            </div>
          )
        },
        th({ children }) {
          return (
            <th className="border border-gray-300 dark:border-gray-600 px-3 py-2 bg-gray-50 dark:bg-gray-800 font-semibold text-left text-sm">
              {children}
            </th>
          )
        },
        td({ children }) {
          return <td className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm">{children}</td>
        },
      }}
    >
      {content}
    </ReactMarkdown>
  )
}

const MessageActions = ({ content, onRegenerate }: { content: string; onRegenerate: () => void }) => {
  const [copied, setCopied] = useState(false)

  const copyMessage = () => {
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <Button variant="ghost" size="sm" onClick={copyMessage} className="h-7 w-7 p-0 text-gray-400 hover:text-gray-600">
        {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onRegenerate}
        className="h-7 w-7 p-0 text-gray-400 hover:text-gray-600"
      >
        <RotateCcw className="h-3 w-3" />
      </Button>
    </div>
  )
}

export default function MultiModelChatbot() {
  const [selectedModel, setSelectedModel] = useState(AI_MODELS[0].id)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { messages, input, handleInputChange, handleSubmit, setMessages, reload, isLoading } = useChat({
    api: "/api/chat",
    body: {
      model: selectedModel,
    },
  })

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    handleSubmit(e)
  }

  const clearChat = () => {
    setMessages([])
  }

  const selectedModelInfo = AI_MODELS.find((model) => model.id === selectedModel)
  const ModelIcon = selectedModelInfo?.icon || Bot

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Chat Messages */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="max-w-4xl mx-auto px-4 py-6">
            {messages.length === 0 && (
              <div className="text-center py-12 sm:py-20">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Bot className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">AI Assistant</h1>
                <p className="text-gray-600 max-w-md mx-auto text-sm sm:text-base">
                  Choose a model below and start chatting. I can help with coding, analysis, writing, and much more.
                </p>
              </div>
            )}

            <div className="space-y-6">
              {messages.map((message) => (
                <div key={message.id} className="group">
                  {message.role === "user" ? (
                    <div className="flex justify-end">
                      <div className="flex items-start gap-2 sm:gap-3 max-w-[85%] sm:max-w-2xl">
                        <div className="bg-blue-600 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-2xl rounded-tr-md">
                          <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap">{message.content}</p>
                        </div>
                        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-start">
                      <div className="flex items-start gap-2 sm:gap-3 max-w-[90%] sm:max-w-3xl">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <Bot className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                        </div>
                        <div className="flex-1 bg-white rounded-2xl rounded-tl-md px-3 sm:px-4 py-2 sm:py-3 shadow-sm border border-gray-200">
                          <div className="prose prose-sm sm:prose-base max-w-none">
                            <MessageContent content={message.content} />
                          </div>
                          <MessageActions content={message.content} onRegenerate={() => reload()} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-start gap-2 sm:gap-3 max-w-[90%] sm:max-w-3xl">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                    </div>
                    <div className="bg-white rounded-2xl rounded-tl-md px-3 sm:px-4 py-2 sm:py-3 shadow-sm border border-gray-200">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        </div>
                        <span className="text-sm text-gray-600">Thinking...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 bg-white">
        <div className="max-w-4xl mx-auto p-4">
          {/* Model Selector */}
          <div className="mb-3">
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger className="w-full h-auto sm:w-80 [&>svg]:text-muted-foreground/80 [&>svg]:shrink-0 text-sm">
                <div className="flex items-center gap-2">
                  <ModelIcon size={14} aria-hidden="true" />
                  <SelectValue placeholder="Choose an AI model" />
                </div>
              </SelectTrigger>
              <SelectContent className="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8">
                <SelectGroup>
                  <SelectLabel className="ps-2 text-xs">AI Models</SelectLabel>
                  {AI_MODELS.map((model) => {
                    const Icon = model.icon
                    return (
                      <SelectItem key={model.id} value={model.id} className="flex flex-col items-start">
                        <div className="flex items-center gap-2">
                          <Icon size={14} />
                          <span className="text-sm">{model.name}</span>
                        </div>
                        <span className="text-muted-foreground mt-1 block text-xs" data-desc>
                          {model.description}
                        </span>
                      </SelectItem>
                    )
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Input Form */}
          <form onSubmit={onSubmit} className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                value={input}
                onChange={handleInputChange}
                placeholder={`Message ${selectedModelInfo?.name}...`}
                className="pr-12 py-3 text-sm sm:text-base border-gray-300 rounded-xl resize-none"
                disabled={isLoading}
              />
              {messages.length > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={clearChat}
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              )}
            </div>
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-3 rounded-xl flex-shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>

          {/* Model Info */}
          <div className="mt-2 text-xs text-gray-500 flex items-center gap-1">
            <ModelIcon size={12} />
            <span>Using {selectedModelInfo?.name}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
