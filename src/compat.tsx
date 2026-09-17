"use client";
/** Temporary adapters for existing application APIs. New code uses the root exports. */
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import {
  Button as KumoButton,
  LinkButton,
  type ButtonProps as KumoProps,
} from "./index.js";
import { LinkProvider } from "@cloudflare/kumo";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

type Variant =
  | "default"
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "link"
  | "destructive"
  | "headerCta";
type Size =
  | "default"
  | "base"
  | "xs"
  | "sm"
  | "lg"
  | "icon"
  | "icon-xs"
  | "icon-sm"
  | "icon-lg";
export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant | null;
  size?: Size | null;
  asChild?: boolean;
};
const ChildContext = React.createContext<React.ReactElement | null>(null);
const SlottedLink = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentProps<"a">
>(function SlottedLink({ children, ...props }, ref) {
  const child = React.useContext(ChildContext)!;
  return (
    <Slot {...props} ref={ref}>
      {React.cloneElement(child, undefined, children)}
    </Slot>
  );
});
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "default",
      size = "default",
      asChild = false,
      className,
      children,
      type,
      ...props
    },
    ref,
  ) {
    const mappedVariant =
      variant === "default" || variant === "headerCta"
        ? "primary"
        : variant === "link"
          ? "ghost"
          : (variant ?? "primary");
    const mappedSize =
      size === "default" || size === "icon" || !size
        ? "base"
        : (size.replace("icon-", "") as KumoProps["size"]);
    const classes = twMerge(
      clsx(
        size?.startsWith("icon") && "p-0 size-9",
        size === "icon-xs" && "size-6",
        size === "icon-sm" && "size-8",
        size === "icon-lg" && "size-10",
        variant === "link" &&
          "h-auto p-0 text-primary underline-offset-4 hover:underline",
        className,
      ),
    );
    if (asChild) {
      const child = React.Children.only(children) as React.ReactElement<{
        children?: React.ReactNode;
      }>;
      return (
        <ChildContext.Provider value={child}>
          <LinkProvider component={SlottedLink}>
            <LinkButton
              {...(props as React.ComponentProps<typeof LinkButton>)}
              ref={ref as unknown as React.Ref<HTMLAnchorElement>}
              variant={mappedVariant}
              size={mappedSize}
              className={classes}
            >
              {child.props.children}
            </LinkButton>
          </LinkProvider>
        </ChildContext.Provider>
      );
    }
    // Existing native/shadcn controls defaulted to submit when placed in a form.
    return (
      <KumoButton
        {...props}
        ref={ref}
        type={type ?? "submit"}
        variant={mappedVariant}
        size={mappedSize}
        className={classes}
      >
        {children}
      </KumoButton>
    );
  },
);
export const NativeButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(function NativeButton({ className, type, ...props }, ref) {
  return (
    <KumoButton
      {...props}
      ref={ref}
      type={type ?? "submit"}
      variant="ghost"
      className={twMerge(
        "h-auto rounded-none p-0 text-inherit font-normal whitespace-normal bg-transparent hover:bg-transparent",
        className,
      )}
    />
  );
});
