"use client";

import * as React from "react";

type ExpiresAt = string | number | Date;

type Props = {
    /** Absolute expiry time. Example: new Date(Date.now()+35*60*1000) or ISO string or epoch ms */
    expiresAt: ExpiresAt;
    /** Called once when time hits 0 */
    onExpire?: () => void;
};

function toMs(expiresAt: ExpiresAt): number {
    if (expiresAt instanceof Date) return expiresAt.getTime();
    if (typeof expiresAt === "number") return expiresAt; // assume epoch ms
    // string (ISO)
    const t = new Date(expiresAt).getTime();
    return Number.isNaN(t) ? 0 : t;
}

function pad2(n: number) {
    return String(n).padStart(2, "0");
}

function clamp0(n: number) {
    return n < 0 ? 0 : n;
}

export function CheckoutCountdown({ expiresAt, onExpire }: Props) {
    const expiryMs = React.useMemo(() => toMs(expiresAt), [expiresAt]);

    const [nowMs, setNowMs] = React.useState(() => Date.now());
    const expiredRef = React.useRef(false);

    React.useEffect(() => {
        expiredRef.current = false;
    }, [expiryMs]);

    React.useEffect(() => {
        const id = window.setInterval(() => setNowMs(Date.now()), 1000);
        return () => window.clearInterval(id);
    }, []);

    const secondsLeft = clamp0(Math.floor((expiryMs - nowMs) / 1000));
    const minutes = Math.floor(secondsLeft / 60);
    const seconds = secondsLeft % 60;

    React.useEffect(() => {
        if (secondsLeft === 0 && !expiredRef.current) {
            expiredRef.current = true;
            onExpire?.();
        }
    }, [secondsLeft, onExpire]);

    return (
        <div className="mx-auto w-full max-w-md rounded-xl bg-gray-100 px-6 py-4 shadow-sm ring-1 ring-slate-200">
            <p className="text-center text-sm text-slate-600">
                We have reserved seats for you. Please complete checkout in:
            </p>

            <div className="mt-2 flex items-center justify-center gap-2">
                <span className="inline-flex h-5 w-5 items-center justify-center text-orange-600">
                    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
                        <path
                            d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z"
                            stroke="currentColor"
                            strokeWidth="2"
                        />
                        <path
                            d="M12 6v6l4 2"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </span>

                <span className="text-2xl font-semibold tabular-nums text-orange-600">
                    {pad2(minutes)} : {pad2(seconds)} mins
                </span>
            </div>
        </div>
    );
}
