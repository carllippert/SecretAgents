const LeftPanel = ({ children }) => {
  return (
    <div className="flex flex-col w-64 border-r border-gray-700">
      {children}
    </div>
  );
};

export default LeftPanel;
