"use client";

import { useEffect, useState } from "react";
import { VIDEO_CALL_TIMING } from "@/lib/kinFlow";

export interface VideoCallScreenProps {
  onEndCall: () => void;
}

export default function VideoCallScreen({ onEndCall }: VideoCallScreenProps) {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setConnected(true), VIDEO_CALL_TIMING.connectingFor);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="phone-screen" id="screen-video-call" data-testid="screen-videoCall" tabIndex={-1} aria-label="Video call with a nurse">
      <div className="video-stage">
        <div className="video-tile video-tile-remote" data-testid="video-remote">
          {connected ? (
            <>
              <span className="avatar pro" style={{ width: 56, height: 56, fontSize: "1rem" }} aria-hidden="true">
                RN
              </span>
              <span className="video-name">Nurse Aanya</span>
            </>
          ) : (
            <span role="status" className="video-status">
              Connecting to a nurse…
            </span>
          )}
        </div>
        <div className="video-tile video-tile-self" data-testid="video-self" aria-hidden="true">
          <span className="video-name">You</span>
        </div>
      </div>
      <div className="screen-footer video-footer">
        {connected && (
          <p className="video-connected-note" data-testid="video-connected-note" role="status">
            Connected — this is a simulated call for the walkthrough.
          </p>
        )}
        <button type="button" className="cta-primary" data-testid="end-call" onClick={onEndCall}>
          End call
        </button>
      </div>
    </section>
  );
}
