import "./styles.css"

import { StrictMode, useState } from "react"
import { createRoot } from "react-dom/client"
import { Download, Plus, RefreshCw, Save, Trash2 } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { CopyButton } from "@/components/ui/copy-button"
import { Spinner } from "@/components/ui/spinner"

const dark = document.documentElement.classList.contains("dark")

const variants = ["default", "outline", "secondary", "ghost", "destructive", "link"] as const
const sizes = ["sm", "default", "lg"] as const
const iconSizes = ["icon-xs", "icon-sm", "icon", "icon-lg"] as const

const swatches = [
  ["canvas", "bg-canvas"],
  ["surface", "bg-surface"],
  ["surface-raised", "bg-surface-raised"],
  ["surface-sunken", "bg-surface-sunken"],
  ["primary", "bg-primary"],
  ["selection", "bg-selection"],
  ["focus", "bg-focus"],
  ["text", "bg-text"],
  ["text-muted", "bg-text-muted"],
  ["border", "bg-border"],
  ["status-info", "bg-status-info"],
  ["status-success", "bg-status-success"],
  ["status-warning", "bg-status-warning"],
  ["status-danger", "bg-status-danger"],
] as const

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="space-y-4 rounded-lg border bg-surface p-6">
      <h2 id={`${id}-title`} className="text-base font-semibold">
        {title}
      </h2>
      {children}
    </section>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-3 sm:grid-cols-[9rem_1fr] sm:items-center">
      <div className="font-mono text-xs text-muted-foreground">{label}</div>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  )
}

function SaveDemo() {
  const [saving, setSaving] = useState(false)
  return (
    <Button
      data-testid="save-demo"
      loading={saving}
      onClick={() => {
        setSaving(true)
        window.setTimeout(() => setSaving(false), 1500)
      }}
    >
      <Save />
      Save changes
    </Button>
  )
}

function App() {
  return (
    <main className="mx-auto max-w-5xl space-y-6 p-8">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">VEXXHOST UI</h1>
          <p className="text-sm text-muted-foreground">
            Components from this registry, rendered with the VEXXHOST theme.
          </p>
        </div>
        <a className={buttonVariants({ variant: "outline", size: "sm" })} href={dark ? "?" : "?theme=dark"}>
          {dark ? "Light mode" : "Dark mode"}
        </a>
      </header>

      <Section id="theme" title="Theme">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {swatches.map(([name, className]) => (
            <div key={name} className="space-y-1.5">
              <div className={`h-12 rounded-md border ${className}`} />
              <div className="font-mono text-[11px] text-muted-foreground">{name}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section id="button" title="Button">
        <Row label="variant">
          {variants.map((variant) => (
            <Button key={variant} variant={variant}>
              {variant === "destructive" ? <Trash2 /> : <Plus />}
              {variant === "default" ? "Create instance" : variant}
            </Button>
          ))}
        </Row>
        <Row label='tone="danger"'>
          <Button variant="outline" tone="danger">
            <Trash2 />
            Delete volume
          </Button>
          <Button variant="ghost" tone="danger">
            <Trash2 />
            Remove rule
          </Button>
          <Button variant="link" tone="danger">
            Revoke access
          </Button>
          <Button variant="outline" tone="danger" size="icon" aria-label="Delete image" title="Delete image">
            <Trash2 />
          </Button>
          <Button variant="ghost" tone="danger" size="icon-sm" aria-label="Remove tag" title="Remove tag">
            <Trash2 />
          </Button>
        </Row>
        <Row label="size">
          {sizes.map((size) => (
            <Button key={size} size={size} variant="outline">
              <RefreshCw />
              {size}
            </Button>
          ))}
        </Row>
        <Row label="icon sizes">
          {iconSizes.map((size) => (
            <Button key={size} size={size} variant="outline" aria-label={`Download (${size})`} title={size}>
              <Download />
            </Button>
          ))}
        </Row>
        <Row label="disabled">
          <Button disabled>
            <Plus />
            Create
          </Button>
          <Button variant="outline" disabled>
            Cancel
          </Button>
          <Button variant="outline" tone="danger" disabled>
            <Trash2 />
            Delete
          </Button>
        </Row>
        <Row label="loading">
          <Button loading>
            <Save />
            Saving
          </Button>
          <Button variant="outline" loading>
            <RefreshCw />
            Refresh
          </Button>
          <Button variant="ghost" size="icon-sm" loading aria-label="Refreshing">
            <RefreshCw />
          </Button>
          <SaveDemo />
        </Row>
        <Row label="as a link">
          <a className={buttonVariants({ variant: "outline" })} href="#button">
            <Download />
            Download payload
          </a>
        </Row>
      </Section>

      <Section id="copy-button" title="Copy button">
        <Row label="icon">
          <code className="rounded bg-muted px-2 py-1 font-mono text-sm">8f2c1a90-4d1e-4b6f-9d1c-2a6e0b7d5c31</code>
          <CopyButton data-testid="copy-icon" value="8f2c1a90-4d1e-4b6f-9d1c-2a6e0b7d5c31" label="Copy ID" />
        </Row>
        <Row label="showLabel">
          <CopyButton value="ssh-ed25519 AAAAC3Nza... ops@vexxhost" label="Copy" showLabel variant="outline" />
          <CopyButton value="https://k8s.example.net:6443" label="Copy endpoint" variant="outline" size="icon" />
        </Row>
      </Section>

      <Section id="spinner" title="Spinner">
        <Row label="default">
          <Spinner />
          <Spinner className="size-6 text-primary" />
        </Row>
      </Section>
    </main>
  )
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
