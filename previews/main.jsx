import React from "react";
import { createRoot } from "react-dom/client";
import { Button, LinkButton } from "../dist/index.js";
import "../dist/styles.css";

const params = new URLSearchParams(location.search);
const app = params.get("app") || "ui";
const dark = params.get("theme") === "dark";
document.documentElement.classList.toggle("dark", dark);
document.documentElement.dataset.theme = dark ? "dark" : "light";
if (app !== "ui") await import(`./generated/${app}.css`);
const labels = {
  ui: "Shared UI",
  website: "Website",
  eventhub: "EventHub",
  onboarding: "Onboarding",
  atlas: "Atlas",
};
const descriptions = {
  ui: "Direct Kumo exports. One VEXXHOST theme.",
  website: "Calls to action, navigation links, and pagination.",
  eventhub: "Capture actions, secondary controls, and administration.",
  onboarding: "Sign-in, profile, payment, and staff actions.",
  atlas: "Conversation actions, icon controls, and sidebar buttons.",
};
const Arrow = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M5 12h14m-6-6 6 6-6 6" />
  </svg>
);
const Plus = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M12 5v14M5 12h14" />
  </svg>
);
function Row({ title, children }) {
  return (
    <section className="preview-section">
      <h2>{title}</h2>
      <div className="preview-row">{children}</div>
    </section>
  );
}
function Examples() {
  if (app === "website")
    return (
      <>
        <Row title="Calls to action">
          <Button variant="primary">
            Talk to an expert <Arrow />
          </Button>
          <Button variant="outline">Explore our products</Button>
          <Button variant="ghost">
            Learn more <Arrow />
          </Button>
        </Row>
        <Row title="Links and pagination">
          <LinkButton variant="primary" href="#contact">
            Contact us
          </LinkButton>
          <LinkButton
            variant="outline"
            shape="square"
            size="base"
            href="#page-1"
            aria-current="page"
          >
            1
          </LinkButton>
          <LinkButton variant="ghost" shape="square" size="base" href="#page-2">
            2
          </LinkButton>
          <LinkButton variant="ghost" href="#next">
            Next <Arrow />
          </LinkButton>
        </Row>
      </>
    );
  if (app === "eventhub")
    return (
      <>
        <Row title="Capture actions">
          <Button variant="primary">Save contact</Button>
          <Button variant="outline">Scan another badge</Button>
          <Button variant="ghost">Cancel</Button>
        </Row>
        <Row title="Administration">
          <Button icon={<Arrow />}>Export filtered</Button>
          <LinkButton href="#capture">Capture</LinkButton>
          <LinkButton href="#giveaway">Launch giveaway</LinkButton>
          <Button variant="destructive">Delete contact</Button>
        </Row>
      </>
    );
  if (app === "onboarding")
    return (
      <>
        <Row title="Customer actions">
          <Button variant="primary">
            Continue <Arrow />
          </Button>
          <Button variant="ghost">Sign in</Button>
          <Button variant="primary" disabled>
            Save payment method
          </Button>
        </Row>
        <Row title="Staff controls">
          <Button variant="primary" size="lg">
            Retry activation
          </Button>
          <Button variant="primary">Approve</Button>
          <Button variant="destructive">Reject</Button>
          <Button variant="secondary">Back to reviews</Button>
        </Row>
      </>
    );
  if (app === "atlas")
    return (
      <>
        <Row title="Conversation actions">
          <Button variant="primary">
            <Plus /> New conversation
          </Button>
          <Button variant="outline">Retry</Button>
          <Button variant="ghost">Copy response</Button>
        </Row>
        <Row title="Compact controls and links">
          <Button shape="square" size="base" aria-label="Send message">
            <Arrow />
          </Button>
          <Button
            variant="ghost"
            shape="square"
            size="base"
            aria-label="New thread"
          >
            <Plus />
          </Button>
          <LinkButton variant="outline" href="#settings">
            Settings
          </LinkButton>
          <Button variant="destructive">Delete conversation</Button>
        </Row>
      </>
    );
  return (
    <>
      <Row title="Variants">
        <Button variant="primary">
          Primary <Arrow />
        </Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive">Destructive</Button>
      </Row>
      <Row title="Sizes and links">
        <Button variant="primary" size="xs">
          Extra small
        </Button>
        <Button variant="primary" size="sm">
          Small
        </Button>
        <Button variant="primary">Base</Button>
        <Button variant="primary" size="lg">
          Large
        </Button>
        <LinkButton href="#billing">
          Open billing <Arrow />
        </LinkButton>
      </Row>
    </>
  );
}
createRoot(document.getElementById("root")).render(
  <main className="preview-page">
    <header>
      <div className="preview-kicker">VEXXHOST / {labels[app]}</div>
      <h1>Buttons, brought together.</h1>
      <p>{descriptions[app]}</p>
      <div className="preview-badge">
        {dark ? "Dark" : "Light"} theme · component preview
      </div>
    </header>
    <div className="preview-panel">
      <Examples />
      <Row title="Shared interaction states">
        <Button variant="primary">Save changes</Button>
        <Button variant="primary" loading>
          Saving changes
        </Button>
        <Button variant="primary" disabled>
          Unavailable
        </Button>
        <Button variant="outline" disabled>
          Disabled secondary
        </Button>
      </Row>
    </div>
    <footer>
      Rendered from @vexxhost/ui ·{" "}
      {app === "ui"
        ? "Shared package styles"
        : "Application stylesheet applied"}
      <span>Isolated preview — not an application screenshot</span>
    </footer>
  </main>,
);
const style = document.createElement("style");
style.textContent = `
* { box-sizing: border-box; }
body { margin:0; background: ${dark ? "#111016" : "#f7f6fa"}; color:${dark ? "#f4f1fa" : "#221c32"}; font-family:Inter, ui-sans-serif, system-ui, sans-serif; }
.preview-page { max-width:1160px; margin:0 auto; padding:56px 40px 38px; }
.preview-kicker {font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:${dark ? "#bca1f7" : "#6d28d9"};}
.preview-page h1 { font-size:38px;letter-spacing:-1.4px;font-weight:650;line-height:1.2;margin:18px 0 10px; }
.preview-page p {font-size:16px;margin:0;color:${dark ? "#b5afc0" : "#6f667e"};}
.preview-badge {display:inline-block;font-size:12px;margin-top:24px;padding:7px 12px;border:1px solid ${dark ? "#3b304e" : "#dfd6ec"};border-radius:20px;color:${dark ? "#c5b6dd" : "#695880"};}
.preview-panel {margin-top:30px;border:1px solid ${dark ? "#302a3b" : "#e1dce9"};border-radius:16px;background:${dark ? "#1a1721" : "#fff"};overflow:hidden;}
.preview-section {padding:26px 28px;border-bottom:1px solid ${dark ? "#302a3b" : "#eae5f0"};}.preview-section:last-child {border:0}
.preview-section h2 {font-size:12px;text-transform:uppercase;letter-spacing:1px;font-weight:650;margin:0 0 18px;color:${dark ? "#a59bae" : "#84778e"};}
.preview-row {display:flex;flex-wrap:wrap;gap:14px;align-items:center;min-height:40px;}
.preview-page footer {font-size:11px;color:${dark ? "#91859d" : "#897c95"};margin-top:24px;display:flex;justify-content:space-between;gap:16px;}
@media(max-width:600px){.preview-page{padding:28px 20px}.preview-page h1{font-size:29px}.preview-section{padding:22px 18px}.preview-page footer{flex-direction:column}.preview-row{gap:12px}}
`;
document.head.append(style);
