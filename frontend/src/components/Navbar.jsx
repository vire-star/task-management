import { Bell, Plus, Upload, Users } from "lucide-react"

const Navbar = () => {
  return (
    <nav className="w-full h-[72px] border-b border-zinc-200 bg-white px-6 flex items-center justify-between">

      {/* LEFT: Logo + App Name */}
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-md bg-emerald-600 flex items-center justify-center text-white font-bold">
          TM
        </div>
        <h1 className="text-lg font-semibold text-zinc-800">
          TaskFlow
        </h1>
      </div>

      {/* CENTER: Quick Actions */}
      <div className="flex items-center gap-4">

        {/* Create Task */}
        <button className="flex items-center gap-2 px-3 py-2 text-sm
                           bg-emerald-600 text-white rounded-md
                           hover:bg-emerald-700 transition">
          <Plus size={16} />
          New Task
        </button>

        {/* Upload File */}
        <button className="flex items-center gap-2 px-3 py-2 text-sm
                           border border-zinc-300 rounded-md
                           hover:bg-zinc-100 transition">
          <Upload size={16} />
          Upload
        </button>

        {/* Invite Users */}
        <button className="flex items-center gap-2 px-3 py-2 text-sm
                           border border-zinc-300 rounded-md
                           hover:bg-zinc-100 transition">
          <Users size={16} />
          Invite
        </button>
      </div>

      {/* RIGHT: Notifications + Profile */}
      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-md hover:bg-zinc-100">
          <Bell size={18} />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-emerald-600"></span>
        </button>

        <div className="h-9 w-9 rounded-full bg-zinc-300 flex items-center justify-center text-sm font-medium">
          VP
        </div>
      </div>

    </nav>
  )
}

export default Navbar
