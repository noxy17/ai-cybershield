import { motion } from 'framer-motion';

export default function PageTransition({ children, className = '' }) {
  return (
    <motion.main
      className={className}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.32, ease: 'easeOut' }}
    >
      {children}
    </motion.main>
  );
}
