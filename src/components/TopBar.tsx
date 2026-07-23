"use client";

import Image from "next/image";
import { NOTIFICATION_COUNT } from "@/lib/kinFlow";

export interface TopBarIconRowProps {
  onOpenMenu: () => void;
  onOpenNotifications: () => void;
  showNotificationDot?: boolean;
}

export function TopBarIconRow({ onOpenMenu, onOpenNotifications, showNotificationDot }: TopBarIconRowProps) {
  return (
    <div className="top-bar-row">
      <button type="button" className="top-bar-icon-btn" aria-label="Open menu" onClick={onOpenMenu}>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <span className="top-bar-title">
        <Image src="/kin-mark.png" alt="" width={18} height={18} aria-hidden="true" />
        Kin
      </span>
      <button
        type="button"
        className="top-bar-icon-btn"
        aria-label={showNotificationDot ? `Notifications, ${NOTIFICATION_COUNT} unread` : "Notifications"}
        onClick={onOpenNotifications}
      >
        <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {showNotificationDot && <span className="notification-dot" aria-hidden="true" />}
      </button>
    </div>
  );
}

export interface TopBarProps extends TopBarIconRowProps {
  heading: string;
  subtitle?: string;
}

export default function TopBar({ heading, subtitle, ...iconRowProps }: TopBarProps) {
  return (
    <header className="top-bar">
      <TopBarIconRow {...iconRowProps} />
      <div className="top-bar-heading">
        <h1>{heading}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
    </header>
  );
}
