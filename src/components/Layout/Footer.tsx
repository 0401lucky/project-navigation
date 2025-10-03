export const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-12">
      <div className="container mx-auto px-4 py-6">
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            © {new Date().getFullYear()} 我的项目导航站 |
            <span className="ml-2">基于 React + TypeScript + Vite</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
