const NotificationSidebar = () => {
  return (
    <aside className="absolute top-12 right-0 h-[calc(100vh-114px)] w-3/4 bg-white inset-0 py-1">
      <header className="h-[3rem] w-full flex items-center border-b px-3">
        <h1 className="font-semibold text-base">
          Notifications
        </h1>
        <label className="text-gray-500 font-light text-xs ml-auto">
          Mark all as read
        </label>
      </header>
    </aside>
  )
}

export default NotificationSidebar