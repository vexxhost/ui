import React, { useState, useRef } from "react";
import { createRoot } from "react-dom/client";
import { Button, LinkButton, LinkProvider } from "../dist/index.js";
import { Button as KumoButton } from "@cloudflare/kumo/components/button";
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
        <Button type="submit" name="decision" value="approve">
          Approve
        </Button>
        <Button type="submit" name="decision" value="retry">
          Retry
        </Button>
        <Button onClick={() => setValue("no-submit")}>No submit</Button>
      </form>
      <LinkProvider
        component={React.forwardRef(function RouterLink(props, ref) {
          return <a {...props} ref={ref} data-router-link="true" />;
        })}
      >
        <LinkButton
          variant="primary"
          href="#destination"
          onClick={() => setValue("link-click")}
        >
          Destination
        </LinkButton>
      </LinkProvider>
      <Button
        shape="square"
        aria-label="Add item"
        icon={<span aria-hidden="true">+</span>}
      />
      <Slot data-probe="slot">
        <Button title="Composed action" onClick={() => setValue("slotted")}>
          Slotted
        </Button>
      </Slot>
      <LinkButton href="#other">Other link</LinkButton>
      <output>{value}</output>
    </div>
  );
}
createRoot(document.getElementById("root")).render(<App />);
