import React, { useState, useRef, useCallback, useEffect, useLayoutEffect } from 'react';
import { Play, RotateCcw } from 'lucide-react';
import ComponentCard from './ComponentCard';
import LedgerPanel from './LedgerPanel';
import ExternalRetryPanel from './ExternalRetryPanel';
import ChannelSVG from './ChannelSVG';
import MessageStream from './MessageStream';
import { formatTime, futureDate, formatConnectorName } from './simulationData';

const INVOICE_ID = 'INV-2024-0001';
const INVOICE_AMOUNT = '$49.00';

const SimulationView = ({ paymentConfig, billingConfig }) => {
  const [phase, setPhase] = useState('idle');
  const [active, setActive] = useState(null);
  const [billStatus, setBillStatus] = useState('Idle');
  const [billTone, setBillTone] = useState('idle');
  const [procStatus, setProcStatus] = useState('Idle');
  const [procTone, setProcTone] = useState('idle');
  const [invoiceStatus, setInvoiceStatus] = useState('No invoice');
  const [invoiceTone, setInvoiceTone] = useState('idle');
  const [external, setExternal] = useState([]);
  const [internal, setInternal] = useState([]);
  const [log, setLog] = useState([]);
  const [banner, setBanner] = useState('Press Start to play the full bi-directional flow.');
  const [scenario, setScenario] = useState('soft_decline');
  const [cprMuted, setCprMuted] = useState(true);
  const [escalated, setEscalated] = useState(false);
  const [declineType, setDeclineType] = useState(null);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [accountUpdated, setAccountUpdated] = useState(false);
  const [expiredRevealed, setExpiredRevealed] = useState(false);

  const cardRef = useRef(null);
  const headerRef = useRef(null);
  const controlBarRef = useRef(null);
  const stageWrapRef = useRef(null);
  const stageRef = useRef(null);
  const chipRef = useRef(null);
  const pathRefs = {
    cBP: useRef(null),
    cBR: useRef(null),
    cPR: useRef(null),
  };
  const cancelRef = useRef(false);
  const [stageScale, setStageScale] = useState(1);

  useLayoutEffect(() => {
    const card = cardRef.current;
    const header = headerRef.current;
    const controlBar = controlBarRef.current;
    const wrap = stageWrapRef.current;
    if (!card || !header || !controlBar || !wrap) return;

    const compute = () => {
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      const wScale = w / 1080;
      const hScale = h / 640;
      return Math.min(1, wScale, hScale);
    };

    let rafId;
    let timeoutIds = [];
    const update = () => setStageScale(compute());

    const scheduleUpdate = () => {
      cancelAnimationFrame(rafId);
      timeoutIds.forEach(clearTimeout);
      timeoutIds = [];
      rafId = requestAnimationFrame(() => {
        update();
        timeoutIds.push(setTimeout(update, 120));
        timeoutIds.push(setTimeout(update, 350));
        timeoutIds.push(setTimeout(update, 700));
      });
    };

    scheduleUpdate();
    const ro = new ResizeObserver(scheduleUpdate);
    ro.observe(wrap);
    ro.observe(card);
    window.addEventListener('resize', scheduleUpdate);
    return () => {
      cancelAnimationFrame(rafId);
      timeoutIds.forEach(clearTimeout);
      ro.disconnect();
      window.removeEventListener('resize', scheduleUpdate);
    };
  }, []);

  useEffect(() => {
    return () => {
      cancelRef.current = true;
    };
  }, []);

  const tick = (ms) =>
    new Promise((resolve) => {
      setTimeout(() => {
        if (cancelRef.current) return resolve('cancelled');
        resolve();
      }, ms);
    });

  const addLog = useCallback((route, label, status, tone) => {
    setLog((prev) => [...prev, { time: formatTime(), route, label, status, tone }]);
  }, []);

  const pushExternal = useCallback((item) => {
    setExternal((prev) => [...prev, item]);
  }, []);

  const pushInternal = useCallback((item) => {
    setInternal((prev) => [...prev, item]);
  }, []);

  const patchInternal = useCallback((idx, patch) => {
    setInternal((prev) =>
      prev.map((it, i) => (i === idx ? { ...it, ...patch } : it))
    );
  }, []);

  const flyChip = useCallback((channelId, reverse, color, label) => {
    return new Promise((resolve) => {
      const stage = stageRef.current;
      const chip = chipRef.current;
      const path = pathRefs[channelId]?.current;

      if (!stage || !chip || !path) {
        setTimeout(resolve, 320);
        return;
      }

      const len = path.getTotalLength();

      path.style.stroke = color;
      path.style.strokeDasharray = '1 8';
      path.style.opacity = '1';
      path.style.animation = 'ccflow 0.6s linear infinite';
      path.style.animationDirection = reverse ? 'reverse' : 'normal';

      chip.innerHTML = `<span style="width:8px;height:8px;border-radius:50%;background:${color};flex:none;"></span><span>${label}</span>`;
      chip.style.borderColor = color;
      chip.style.boxShadow = `0 8px 22px -6px ${color}88`;
      chip.style.opacity = '1';

      const cw = chip.offsetWidth || 90;
      const ch = chip.offsetHeight || 28;
      const dur = 1000;
      const t0 = performance.now();
      let done = false;

      const finish = () => {
        if (done) return;
        done = true;
        chip.style.opacity = '0';
        setTimeout(() => {
          path.style.opacity = '0';
          path.style.animation = '';
          path.style.stroke = 'none';
        }, 220);
        resolve();
      };

      const frame = (n) => {
        if (done || cancelRef.current) {
          if (!done) finish();
          return;
        }
        const p = Math.min(1, (n - t0) / dur);
        const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
        const at = reverse ? 1 - e : e;
        const pt = path.getPointAtLength(at * len);
        chip.style.transform = `translate(${pt.x - cw / 2}px, ${pt.y - ch / 2}px)`;
        if (p < 1) requestAnimationFrame(frame);
        else finish();
      };

      requestAnimationFrame(frame);
      setTimeout(finish, dur + 280);
    });
  }, []);

  const run = useCallback(async () => {
    cancelRef.current = false;
    setPhase('running');
    setActive(null);
    setLog([]);
    setExternal([]);
    setInternal([]);
    setBillStatus('Idle');
    setBillTone('idle');
    setProcStatus('Idle');
    setProcTone('idle');
    setInvoiceStatus('No invoice');
    setInvoiceTone('idle');
    setCprMuted(true);
    setEscalated(false);
    setDeclineType(null);
    setActiveCardIndex(0);
    setAccountUpdated(false);
    setExpiredRevealed(false);
    setBanner('Flow in progress\u2026');

    if ((await tick(300)) === 'cancelled') return;

    // 1 — Billing Engine generates invoice
    setActive('bill');
    setBillTone('info');
    setBillStatus(`Invoice ${INVOICE_ID} raised`);
    setInvoiceTone('info');
    setInvoiceStatus('Open');
    addLog('Billing Engine', `invoice ${INVOICE_ID} generated \u00B7 ${INVOICE_AMOUNT}`, 'created', 'listen');
    if ((await tick(600)) === 'cancelled') return;

    // 2 — External retries: Billing → Processor (merchant side, 3 attempts all fail)
    const EXT_TOTAL = 3;
    for (let i = 1; i <= EXT_TOTAL; i++) {
      setActive('bill');
      setProcTone('processing');
      setProcStatus(`Attempt #${i} \u00B7 processing\u2026`);
      await flyChip('cBP', false, '#5e6573', `attempt #${i}`);
      if (cancelRef.current) return;
      addLog('Billing \u2192 Processor', `external attempt #${i} \u00B7 ${INVOICE_AMOUNT}`, 'sent', 'idle');
      setActive('proc');
      if ((await tick(500)) === 'cancelled') return;

      setProcTone('failed');
      setProcStatus(`Declined \u00B7 attempt #${i}`);
      await flyChip('cBP', true, '#EF4444', 'failed');
      if (cancelRef.current) return;
      addLog('Processor \u2192 Billing', `attempt #${i} declined`, 'failed', 'failed');

      pushExternal({
        label: `External retry #${i}`,
        sub: `Merchant \u00B7 Billing Engine`,
        amount: INVOICE_AMOUNT,
        status: 'Failed',
        tone: 'failed',
      });
      setInvoiceTone('failed');
      setInvoiceStatus('Past due');
      setActive('bill');
      if ((await tick(350)) === 'cancelled') return;
    }

    // 3 — External retries exhausted → hand off to Revenue Recovery
    setBillTone('info');
    setBillStatus(`${EXT_TOTAL} retries failed \u00B7 escalating\u2026`);
    setEscalated(true);
    setCprMuted(false);
    if ((await tick(300)) === 'cancelled') return;

    // Chip: Billing → Revenue Recovery (cBR reverse = Billing to Recovery)
    await flyChip('cBR', true, '#0066FF', 'handoff to recovery');
    if (cancelRef.current) return;
    addLog('Billing \u2192 Recovery', `${EXT_TOTAL} external retries exhausted \u00B7 handoff`, 'received', 'listen');
    setActive('rec');
    if ((await tick(400)) === 'cancelled') return;

    // 4 — Revenue Recovery internal retries (scenario-aware)
    const isHard = scenario === 'hard_decline';
    const isCardSwitch = scenario === 'card_switching';
    const isAcctUpdate = scenario === 'account_update';
    // card_switching: 2 fails on card 1, switch, 1 success on card 2
    // account_update: 1 fail (card expired), account updater runs, 1 success on new card
    // hard: 1 fail, stop
    // soft: 1 fail, 1 success
    const INT_TOTAL = isCardSwitch ? 3 : isHard ? 1 : 2;

    for (let i = 1; i <= INT_TOTAL; i++) {
      const date = futureDate(i * 2);
      const idx = i - 1;

      pushInternal({
        label: `Recovery retry #${i}`,
        sub: `Scheduled ${date}`,
        amount: INVOICE_AMOUNT,
        status: 'Scheduled',
        tone: 'scheduled',
      });
      setActive('rec');
      addLog('Recovery \u00B7 internal', `scheduled retry #${i} for ${date}`, 'scheduled', 'scheduled');
      if ((await tick(600)) === 'cancelled') return;

      patchInternal(idx, { status: 'Processing', tone: 'processing' });
      setProcTone('processing');
      setProcStatus(`Recovery retry #${i}\u2026`);
      await flyChip('cPR', true, '#0066FF', `recovery retry #${i}`);
      if (cancelRef.current) return;
      addLog('Recovery \u2192 Processor', `recovery retry #${i}`, 'retrying', 'listen');
      setActive('proc');
      if ((await tick(650)) === 'cancelled') return;

      // card switching: retries 1 & 2 fail, retry 3 succeeds (after card switch)
      // account update: retry 1 fails (expired), retry 2 succeeds (new card)
      const succeeded = isCardSwitch ? i === 3 : (!isHard && i === INT_TOTAL);

      if (!succeeded) {
        setProcTone('failed');
        setProcStatus(`Declined \u00B7 attempt #${i}`);
        await flyChip('cPR', false, '#EF4444', 'failed');
        if (cancelRef.current) return;
        addLog('Processor \u2192 Recovery', 'payment.failed webhook', 'failed', 'failed');
        patchInternal(idx, { status: 'Failed', sub: `Attempted ${date}`, tone: 'failed' });
        setActive('rec');
        if ((await tick(400)) === 'cancelled') return;

        // After first internal attempt → classify decline type
        if (i === 1) {
          const dtype = isHard ? 'hard' : isAcctUpdate ? 'expired' : 'soft';
          setDeclineType(dtype);
          addLog('Recovery \u00B7 analysis', `Classified as ${isHard ? 'Hard Decline' : isAcctUpdate ? 'Card Expired' : 'Soft Decline'}`, 'classified', isHard ? 'failed' : 'scheduled');
          if ((await tick(400)) === 'cancelled') return;

          if (isHard) {
            setInvoiceTone('failed');
            setInvoiceStatus('Unrecoverable');
            setPhase('done');
            setBanner('\u26A0 Hard decline \u00B7 invoice cannot be recovered automatically.');
            return;
          }

          // Account Update: run Juspay account updater to find new card
          if (isAcctUpdate) {
            setExpiredRevealed(true);
            addLog('Recovery \u00B7 account updater', 'Searching for updated card details\u2026', 'scheduled', 'scheduled');
            if ((await tick(800)) === 'cancelled') return;
            setAccountUpdated(true);
            addLog('Recovery \u00B7 account updater', 'Found new card \u2022\u2022\u2022\u2022 7890 (Visa) \u00B7 Exp 03/28', 'received', 'success');
            setBillStatus('New card found \u00B7 retrying\u2026');
            if ((await tick(500)) === 'cancelled') return;
          }
        }

        // Card switching: after 2 fails, switch to backup card
        if (isCardSwitch && i === 2) {
          if ((await tick(300)) === 'cancelled') return;
          setActiveCardIndex(1);
          addLog('Recovery \u00B7 card switch', 'Switching to backup card \u2022\u2022\u2022\u2022 8888 (Mastercard)', 'switching', 'scheduled');
          setBillStatus('Card switched \u00B7 retrying\u2026');
          if ((await tick(600)) === 'cancelled') return;
        }
      } else {
        const cardLabel = isCardSwitch ? 'Mastercard \u2022\u2022\u2022\u2022 8888' : 'primary card';
        setProcTone('success');
        setProcStatus('Payment succeeded \u2713');
        await flyChip('cPR', false, '#10B981', 'succeeded');
        if (cancelRef.current) return;
        addLog('Processor \u2192 Recovery', `payment.succeeded \u00B7 ${cardLabel}`, 'recovered', 'success');
        patchInternal(idx, { status: 'Succeeded', sub: `Captured ${date}`, tone: 'success' });
        setActive('rec');
        if ((await tick(450)) === 'cancelled') return;
      }
    }

    // 5 — Recovery marks invoice paid at Billing
    await flyChip('cBR', false, '#10B981', 'mark paid (API)');
    if (cancelRef.current) return;
    addLog('Recovery \u2192 Billing', 'PATCH invoice \u2192 paid (API)', 'sent', 'success');
    setActive(null);
    setBillTone('success');
    setBillStatus(`${INVOICE_ID} \u00B7 paid \u2713`);
    setInvoiceTone('recovered');
    setInvoiceStatus('Recovered');
    setPhase('done');
    setBanner(`\u2713 Recovered ${INVOICE_AMOUNT} \u00B7 ${EXT_TOTAL} external + ${INT_TOTAL} internal retries.`);
  }, [flyChip, addLog, pushExternal, pushInternal, patchInternal, scenario]);

  const onStart = () => {
    if (phase !== 'running') run();
  };

  const paymentName = formatConnectorName(paymentConfig?.processor) || 'Stripe';
  const billingName = formatConnectorName(billingConfig?.processor) || 'Chargebee';

  const btnLabel = phase === 'running' ? 'Running\u2026' : phase === 'done' ? 'Replay flow' : '\u25B6  Start';
  const btnBg = phase === 'running' ? '#9bb6e6' : '#0066FF';
  const btnCursor = phase === 'running' ? 'default' : 'pointer';

  return (
    <div ref={cardRef} className="flex flex-col" style={{ flex: 1, minHeight: 0, gap: '12px' }}>

      {/* Header row — outside card */}
      <div ref={headerRef} className="flex items-center justify-between" style={{ flexShrink: 0 }}>
        <div>
          <div className="font-bold" style={{ fontSize: '17px', color: '#1a1f36', letterSpacing: '-0.01em' }}>
            Revenue Recovery &mdash; Component Communication
          </div>
          <div style={{ fontSize: '12.5px', color: '#9099a8', marginTop: '3px' }}>
            Messages travel as chips across two-way channels &middot; Recovery keeps the invoice ledger
          </div>
        </div>
        <button
          onClick={onStart}
          disabled={phase === 'running'}
          className="text-white font-semibold flex items-center gap-1.5"
          style={{
            fontSize: '13px',
            background: btnBg,
            border: 'none',
            borderRadius: '9px',
            padding: '10px 20px',
            cursor: btnCursor,
            boxShadow: '0 2px 8px rgba(0,102,255,.3)',
            flexShrink: 0,
          }}
        >
          {phase !== 'running' && phase !== 'done' && <Play size={14} />}
          {phase === 'done' && <RotateCcw size={14} />}
          {btnLabel}
        </button>
      </div>

      {/* Canvas card — includes scenario tabs at top */}
      <div
        className="bg-white rounded-2xl overflow-hidden flex flex-col"
        style={{ border: '1px solid #e5e7eb', boxShadow: '0 20px 40px -16px rgba(15,23,42,.12)', flex: 1, minHeight: 0 }}
      >
        {/* Scenario tabs + badges row */}
        <div ref={controlBarRef} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, gap: 12, padding: '10px 14px', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#f7f8fa', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '4px' }}>
{[
              { id: 'soft_decline', label: 'Soft Decline' },
              { id: 'card_switching', label: 'Card Switching' },
              { id: 'account_update', label: 'Account Update' },
              { id: 'hard_decline', label: 'Hard Decline' },
            ].map(t => {
              const active = scenario === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => { if (phase !== 'running') setScenario(t.id); }}
                  style={{
                    fontSize: '12px',
                    fontWeight: active ? 600 : 400,
                    padding: '5px 13px',
                    borderRadius: '7px',
                    border: 'none',
                    background: active ? '#fff' : 'transparent',
                    color: active ? '#0066FF' : '#5e6573',
                    cursor: phase === 'running' ? 'default' : 'pointer',
                    boxShadow: active ? '0 1px 4px rgba(0,0,0,.08)' : 'none',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            {[{ label: 'Payment', name: paymentName }, { label: 'Billing', name: billingName }].map(({ label, name }) => (
              <span key={label} style={{ background: '#f1f3f7', border: '1px solid #e5e7eb', borderRadius: '999px', padding: '4px 11px', fontSize: '11.5px', color: '#5e6573' }}>
                {label}: <b style={{ color: '#1a1f36' }}>{name}</b>{' '}
                <span style={{ color: '#10B981' }}>&#10003;</span>
              </span>
            ))}
          </div>
        </div>
      {/* Body: stage (70%) + log (30%) */}
      <div className="flex flex-col lg:flex-row items-stretch overflow-hidden" style={{ flex: 1, minHeight: 0 }}>
        {/* Stage — 70% */}
        <div
          ref={stageWrapRef}
          className="relative overflow-hidden"
          style={{
            flex: '0 0 70%',
            minWidth: 0,
            minHeight: 0,
            background: 'radial-gradient(circle at 50% 40%, #fafbff 0%, #f3f4f7 74%)',
          }}
        >
          <div
            ref={stageRef}
            style={{
              position: 'relative',
              width: 1080,
              height: 640,
              transform: `scale(${stageScale})`,
              transformOrigin: 'top left',
            }}
          >
            <ChannelSVG pathRefs={pathRefs} mutedChannels={cprMuted ? ['cPR', 'cBR'] : []} />

            {/* Traveling message chip */}
            <div
              ref={chipRef}
              className="absolute"
              style={{
                top: 0,
                left: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                padding: '6px 11px',
                background: '#fff',
                border: '1.5px solid #dde1e9',
                borderRadius: '999px',
                boxShadow: '0 8px 20px -6px rgba(15,23,42,.32)',
                fontSize: '11.5px',
                fontWeight: 600,
                color: '#1a1f36',
                whiteSpace: 'nowrap',
                opacity: 0,
                pointerEvents: 'none',
                transform: 'translate(-300px, -300px)',
                zIndex: 9,
              }}
            />

            {/* Billing card */}
            <ComponentCard
              title="Billing Engine"
              provider={billingName}
              iconType="billing"
              status={billStatus}
              tone={billTone}
              isActive={active === 'bill'}
              position={{ left: 50, top: 44, width: 275 }}
              invoiceDetails={(() => {
                const base = { id: INVOICE_ID, amount: INVOICE_AMOUNT, account: 'cus_Np8x42', email: 'john.doe@acme.io' };
                if (scenario === 'card_switching') return {
                  ...base,
                  cards: [
                    { network: 'VISA', last4: '4242', expiry: '12/26' },
                    { network: 'MC',   last4: '8888', expiry: '09/27' },
                  ],
                  activeCard: activeCardIndex,
                };
                if (scenario === 'account_update') return {
                  ...base,
                  cards: accountUpdated
                    ? [
                        { network: 'VISA', last4: '4242', expiry: '06/23', expired: true, expiredRevealed },
                        { network: 'VISA', last4: '7890', expiry: '03/28' },
                      ]
                    : [{ network: 'VISA', last4: '4242', expiry: '06/23', expired: true, expiredRevealed }],
                  activeCard: accountUpdated ? 1 : 0,
                };
                return {
                  ...base,
                  cards: [{ network: 'VISA', last4: '4242', expiry: '12/26' }],
                  activeCard: 0,
                };
              })()}
            />

            {/* Processor card */}
            <ComponentCard
              title="Payment Processor"
              provider={paymentName}
              iconType="payment"
              status={procStatus}
              tone={procTone}
              isActive={active === 'proc'}
              position={{ left: 790, top: 44, width: 240 }}
            />

            {/* External Retries panel (merchant side) */}
            <ExternalRetryPanel
              items={external}
              isActive={active === 'bill'}
              escalated={escalated}
              position={{ left: 50, top: 290, width: 370 }}
            />

            {/* Revenue Recovery panel (Hyperswitch internal) */}
            <LedgerPanel
              invoiceId={INVOICE_ID}
              invoiceAmount={INVOICE_AMOUNT}
              invoiceStatus={invoiceStatus}
              invoiceTone={invoiceTone}
              internal={internal}
              isActive={active === 'rec'}
              muted={cprMuted}
              declineType={declineType}
              position={{ left: 445, top: 290, width: 580 }}
            />
          </div>
        </div>

        {/* Message stream — 30% */}
        <MessageStream log={log} phase={phase} />
      </div>
      </div>
    </div>
  );
};

export default SimulationView;
