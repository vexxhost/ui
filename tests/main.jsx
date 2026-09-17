import React, { useState, useRef } from "react";
import { createRoot } from "react-dom/client";
import { Button, LinkButton } from "../dist/index.js";
import { Button as KumoButton } from "@cloudflare/kumo/components/button";
import { Button as LegacyButton, NativeButton } from "../dist/compat.js";
import { Slot } from "@radix-ui/react-slot";
import "../dist/styles.css";
if (Button !== KumoButton)
  throw Error("Root Button must be a true passthrough");
function App() {
  const [value, setValue] = useState(""),
    [busy, setBusy] = useState(false);
  const ref = useRef(null);
  return (
    <div
      style={{
        padding: 32,
        display: "grid",
        gap: 16,
        fontFamily: "sans-serif",
      }}
    >
      <Button variant="primary" ref={ref} onClick={() => setValue("clicked")}>
        Primary
      </Button>
      <Button
        onClick={() => {
          ref.current.focus();
          setValue("focused");
        }}
      >
        Focus primary
      </Button>
      <Button
        data-testid="save"
        variant="primary"
        loading={busy}
        onClick={() => setBusy(true)}
      >
        Save
      </Button>
      <Button disabled onClick={() => setValue("wrong")}>
        Disabled
      </Button>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setValue(e.nativeEvent.submitter.value);
        }}
      >
        <NativeButton name="decision" value="approve">
          Approve
        </NativeButton>
        <LegacyButton name="decision" value="retry">
          Retry
        </LegacyButton>
        <Button onClick={() => setValue("no-submit")}>No submit</Button>
      </form>
      <LegacyButton asChild variant="primary">
        <a href="#destination" onClick={() => setValue("link-click")}>
          Destination
        </a>
      </LegacyButton>
      <Slot data-probe="slot">
        <LegacyButton onClick={() => setValue("slotted")}>Slotted</LegacyButton>
      </Slot>
      <LinkButton href="#other">Other link</LinkButton>
      <output>{value}</output>
    </div>
  );
}
createRoot(document.getElementById("root")).render(<App />);
