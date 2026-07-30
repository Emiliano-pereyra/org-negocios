import { CONTACT_LINKS } from "@/config/navigation";

function ContactIcon({ type }) {
  if (type === "whatsapp") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M12 2C6.486 2 2 6.486 2 12c0 1.846.503 3.58 1.382 5.069L2 22l5.082-1.338A9.955 9.955 0 0012 22c5.514 0 10-4.486 10-10S17.514 2 12 2zm0 18.182a8.18 8.18 0 01-4.163-1.134l-.298-.178-3.015.793.804-2.94-.195-.302A8.182 8.182 0 014.818 12c0-4.515 3.667-8.182 8.182-8.182S21.182 7.485 21.182 12 17.515 20.182 12 20.182z" />
      </svg>
    );
  }

  if (type === "instagram") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
        <path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm10 2H7a3 3 0 00-3 3v10a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3zm-5 3.5a5.5 5.5 0 110 11 5.5 5.5 0 010-11zm0 2a3.5 3.5 0 100 7 3.5 3.5 0 000-7zm5.75-2.25a1.25 1.25 0 110 2.5 1.25 1.25 0 010-2.5z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
      <path d="M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm0 2v.01L12 13l8-6.99V6H4zm16 12V9.25l-7.4 6.48a1 1 0 01-1.2 0L4 9.25V18h16z" />
    </svg>
  );
}

export default function ContactIcons() {
  return (
    <div className="flex items-center gap-3">
      {CONTACT_LINKS.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={link.label}
          className="flex h-9 w-9 items-center justify-center rounded-md border border-neutral-300 bg-neutral-50 text-neutral-700 transition hover:border-neutral-400 hover:bg-neutral-100 hover:text-neutral-900"
        >
          <ContactIcon type={link.icon} />
        </a>
      ))}
    </div>
  );
}
