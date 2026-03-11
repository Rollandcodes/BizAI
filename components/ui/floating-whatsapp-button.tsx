export function FloatingWhatsAppButton() {
  return (
    <div className="fixed bottom-5 left-4 z-50 sm:bottom-6 sm:left-6">
      <a
        href="https://wa.me/905338425559?text=Hi%2C%20I%27m%20interested%20in%20BizAI"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="group relative flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366] sm:h-14 sm:w-14 [animation:whatsapp-bounce_3s_ease-in-out_infinite] before:absolute before:inset-0 before:rounded-full before:border-4 before:border-[#25D366] before:animate-ping before:opacity-50"
      >
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="h-6 w-6 sm:h-7 sm:w-7"
          fill="currentColor"
        >
          <path d="M20.52 3.48A11.86 11.86 0 0 0 12.06 0C5.56 0 .27 5.3.27 11.79c0 2.08.54 4.12 1.57 5.92L0 24l6.48-1.7a11.78 11.78 0 0 0 5.57 1.42h.01c6.5 0 11.79-5.3 11.79-11.79 0-3.14-1.22-6.09-3.33-8.45Zm-8.46 18.27h-.01a9.84 9.84 0 0 1-5.01-1.37l-.36-.21-3.84 1.01 1.02-3.74-.24-.38a9.8 9.8 0 0 1-1.52-5.27c0-5.42 4.41-9.83 9.84-9.83 2.62 0 5.08 1.02 6.94 2.89a9.77 9.77 0 0 1 2.89 6.95c0 5.42-4.41 9.83-9.83 9.83Zm5.39-7.37c-.3-.15-1.78-.88-2.05-.98-.27-.1-.47-.15-.66.15-.2.3-.76.98-.93 1.18-.17.2-.34.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.48-1.74-1.65-2.04-.17-.3-.02-.46.13-.61.13-.13.3-.34.44-.51.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.66-1.6-.91-2.2-.24-.58-.48-.5-.66-.5h-.56c-.2 0-.52.08-.79.37-.27.3-1.04 1.02-1.04 2.5 0 1.47 1.06 2.9 1.21 3.1.15.2 2.08 3.18 5.05 4.46.71.31 1.27.5 1.7.64.71.22 1.35.19 1.86.12.57-.08 1.78-.73 2.03-1.43.25-.69.25-1.29.17-1.42-.08-.12-.27-.2-.57-.35Z" />
        </svg>

        <span className="pointer-events-none absolute left-14 hidden whitespace-nowrap rounded-md bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-white opacity-0 shadow-sm transition-opacity group-hover:opacity-100 sm:block">
          Chat with us on WhatsApp
        </span>
      </a>
    </div>
  );
}
