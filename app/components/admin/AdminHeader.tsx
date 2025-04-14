interface AdminHeaderProps {
  title: string;
  onAdd: () => void;
}

export default function AdminHeader({ title, onAdd }: AdminHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
        {title}
      </h1>
      <button
        onClick={onAdd}
        className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
      >
        Add New
      </button>
    </div>
  );
}
