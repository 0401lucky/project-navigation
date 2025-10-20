interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const Container: React.FC<ContainerProps> = ({ children, className = '' }) => {
  return (
    <div className={`max-w-screen-2xl w-full mx-auto px-4 py-8 ${className}`}>
      {children}
    </div>
  );
};
