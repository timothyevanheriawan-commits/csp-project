import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  buttonText: string;
  buttonHref: string;
}

export default function EmptyState({ icon: Icon, title, description, buttonText, buttonHref }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-16"
    >
      <div className="bg-white rounded-2xl p-10 max-w-sm mx-auto border border-primary-100"
        style={{ boxShadow: 'var(--shadow-md)' }}>
        <div className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center mx-auto mb-5">
          <Icon className="w-7 h-7 text-primary-400 animate-float" />
        </div>
        <h3 className="font-heading text-xl text-text mb-2">{title}</h3>
        <p className="text-text-secondary text-sm mb-6 leading-relaxed">{description}</p>
        <Link
          href={buttonHref}
          className="btn btn-primary px-6 py-3 rounded-xl text-sm"
        >
          {buttonText}
        </Link>
      </div>
    </motion.div>
  );
}