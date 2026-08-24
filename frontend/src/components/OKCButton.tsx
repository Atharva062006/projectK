"use client";
/**
 * OKCButton — Apple Button wrapper for Project K
 * Direct bridge to Apple Design System Button component
 */
import Button, { ButtonProps } from "./ui/Button";

export default function OKCButton(props: ButtonProps) {
  return <Button {...props} />;
}
