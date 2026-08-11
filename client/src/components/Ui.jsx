/**
 * De kleine, gedeelde bouwstenen van de interface.
 * Bewust in één bestand: het zijn stuk voor stuk enkele regels opmaak.
 */

export function Loader({ label = 'De coach denkt na…' }) {
  return (
    <div className="loader" role="status" aria-live="polite">
      <span className="loader-dot" aria-hidden="true" />
      <span className="loader-dot" aria-hidden="true" />
      <span className="loader-dot" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

export function ErrorBanner({ message, onRetry }) {
  if (!message) return null;

  return (
    <div className="banner banner-error" role="alert">
      <p className="banner-title">Dat lukte niet</p>
      <p>{message}</p>
      {onRetry && (
        <p style={{ marginTop: 'var(--space-3)' }}>
          <button type="button" className="btn btn-secondary" onClick={onRetry}>
            Opnieuw proberen
          </button>
        </p>
      )}
    </div>
  );
}

/** Getoond wanneer de coach stopt vanwege een signaal van onveiligheid. */
export function CrisisNotice({ notice }) {
  if (!notice) return null;

  return (
    <div className="banner banner-crisis" role="alert">
      <p className="banner-title">{notice.title}</p>
      <p className="prose">{notice.message}</p>
    </div>
  );
}

export function PrincipleTags({ principles }) {
  if (!principles || principles.length === 0) return null;

  return (
    <div className="tags">
      {principles.map((p) => (
        <span className="tag" key={p}>
          {p}
        </span>
      ))}
    </div>
  );
}

export function PrivacyNote() {
  return (
    <p className="privacy-note">
      Je bepaalt zelf wat je opslaat en kunt alles verwijderen.
    </p>
  );
}

export function Field({ label, hint, children, counter }) {
  return (
    <div>
      <label className="label">{label}</label>
      {hint && (
        <p className="hint" style={{ marginBottom: 'var(--space-2)' }}>
          {hint}
        </p>
      )}
      {children}
      {counter && <p className="counter">{counter}</p>}
    </div>
  );
}

export function ChoiceList({ options, value, onChange, name }) {
  return (
    <div className="choices" role="group" aria-label={name}>
      {options.map((option) => (
        <button
          type="button"
          key={option}
          className="choice"
          aria-pressed={value === option}
          onClick={() => onChange(option)}
        >
          <span className="choice-mark" aria-hidden="true" />
          <span>{option}</span>
        </button>
      ))}
    </div>
  );
}

export function Segmented({ options, value, onChange, label }) {
  return (
    <div className="segmented" role="group" aria-label={label}>
      {options.map((option) => (
        <button
          type="button"
          key={option}
          aria-pressed={value === option}
          onClick={() => onChange(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export function ConfirmDialog({
  open,
  title,
  body,
  confirmLabel,
  cancelLabel = 'Annuleren',
  onConfirm,
  onCancel,
  busy = false,
}) {
  if (!open) return null;

  return (
    <div className="overlay" role="presentation" onClick={onCancel}>
      <div
        className="dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 className="section-title" id="dialog-title">
          {title}
        </h2>
        <p className="hint" style={{ margin: 'var(--space-3) 0 var(--space-5)' }}>
          {body}
        </p>
        <div className="btn-row">
          <button
            type="button"
            className="btn btn-quiet"
            onClick={onCancel}
            disabled={busy}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={onConfirm}
            disabled={busy}
          >
            {busy ? 'Bezig…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
