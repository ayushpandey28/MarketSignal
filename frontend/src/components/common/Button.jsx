export default function Button({ children, className = '', variant = 'primary', ...props }) {
  const styles = {
    primary: 'bg-accent-600 hover:bg-sky-600 text-white',
    ghost: 'bg-white/5 hover:bg-white/10 text-slate-100',
    danger: 'bg-rose-600 hover:bg-rose-500 text-white',
  };
  return (
    <button
      className={`rounded-xl px-4 py-2 text-sm font-medium transition disabled:opacity-50 ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
