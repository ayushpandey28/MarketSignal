export default function ErrorMessage({ message }) {
  if (!message) return null;
  return (
    <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
      {message}
    </p>
  );
}
