import {
  useDeleteWorkshop,
  useGetInvitedWorkshopHook,
  useGetMyWorkshopHook,
  useGetTotalMemberInWorkshopHook,
  useRemoveUserFromWorkshopHook,
} from "@/hooks/workshopHook";
import { userStore } from "@/store/userStore";
import { Trash2, Pencil, Crown, Users, EllipsisVertical } from "lucide-react";
import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  useAssignUserToTaskHook,
  useGetTask,
  useGetTaskAssignedToUser,
} from "@/hooks/task.hook";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import InviteMemberToWorkshop from "@/components/InviteMemberToWorkshop";

const Settings = () => {
  const user = userStore((state) => state.user);
  const { data } = useGetMyWorkshopHook();

  const [activeWorkshopId, setActiveWorkshopId] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [deletePopoverId, setDeletePopoverId] = useState(null);
  const [memberPopoverId, setMemberPopoverId] = useState(null);
  const [deleteDialogMember, setDeleteDialogMember] = useState(null);

  const { mutate: assignUser, isLoading: isAssigning } =
    useAssignUserToTaskHook();

  const { data: totalMember } =
    useGetTotalMemberInWorkshopHook(activeWorkshopId);
    // console.log(totalMember)
  const { data: taskAssignedToUser } = useGetTaskAssignedToUser(selectedUserId);

  const { mutate: removeUserFromWorkshop, isLoading: isRemovingMember } =
    useRemoveUserFromWorkshopHook();
  const { mutate: deleteWorkshop, isLoading: isDeleting } = useDeleteWorkshop();

  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedMemberForAssign, setSelectedMemberForAssign] = useState(null);
  const [availableTasks, setAvailableTasks] = useState([]);

  console.log(selectedMemberForAssign)
  const removeUserFromWorkshopHandler = (member) => {
    removeUserFromWorkshop(
      {
        workshopId: member.workshopId,
        deleteUserId: member.userId._id,
      },
      {
        onSuccess: () => {
          toast.success(`${member.userId.name} removed successfully`);
          setDeleteDialogMember(null);
        },
        onError: (error) => {
          toast.error(
            error?.response?.data?.message || "Failed to remove member"
          );
        },
      }
    );
  };

  const { data: workshopTasks } = useGetTask(activeWorkshopId);
  const { data: invitedWorkshop } = useGetInvitedWorkshopHook();
  // console.log(invitedWorkshop);
  const handleWorkshopClick = (id) => {
    setActiveWorkshopId(id);
  };

  const handleMemberClick = (userId) => {
    setSelectedUserId(userId);
  };

  const handleDeleteWorkshop = (workshopId, workshopName) => {
    deleteWorkshop(workshopId, {
      onSuccess: () => {
        toast.success(`${workshopName} deleted successfully`);
        setDeletePopoverId(null);
      },
      onError: (error) => {
        toast.error(
          error?.response?.data?.message || "Failed to delete workshop"
        );
      },
    });
  };

  const handleAssignTask = (taskId, userId) => {
    console.log(userId)
    assignUser(
      { taskId, userId},
      {
        onSuccess: () => {
          setAssignDialogOpen(false);
        },
      }
    );
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 px-9 pt-9 pb-16 overflow-y-auto">
      {/* Profile Header */}
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 mb-8">
          <div className="flex items-center gap-6">
            <div className="relative">
              <img
                src={user?.avatarUrl}
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                alt={user?.name}
              />
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-slate-800 hover:bg-slate-700 text-white rounded-full flex items-center justify-center shadow-lg transition-colors duration-200">
                <Pencil className="w-4 h-4" />
              </button>
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 capitalize">
                {user?.name}
              </h1>
              <p className="text-slate-600 text-lg mt-1">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Your Workspaces Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Crown className="w-6 h-6 text-slate-600" />
            <h2 className="text-2xl font-bold text-slate-900">
              Your Workspaces
            </h2>
            <span className="px-3 py-1 bg-slate-100 text-slate-700 text-sm font-bold rounded-full">
              {data?.workshops?.length || 0}
            </span>
          </div>

          {data?.workshops?.length > 0 ? (
            <Accordion type="single" collapsible className="space-y-3">
              {data.workshops.map((item, index) => (
                <AccordionItem
                  key={item._id || index}
                  value={`workshop-${index}`}
                  className="border border-slate-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-all overflow-hidden"
                >
                  {/* ✅ Custom Header with proper positioning */}
                  <div className="relative">
                    <AccordionTrigger
                      onClick={() => handleWorkshopClick(item._id)}
                      className="px-5 py-4 w-full hover:no-underline hover:bg-slate-50 transition-all"
                    >
                      <div className="flex items-center gap-3 pr-12">
                        <div className="text-left flex-1">
                          <h3 className="font-bold text-lg text-slate-900">
                            {item.name}
                          </h3>
                          {item.description && (
                            <p className="text-xs text-slate-500 mt-1 mb-2">
                              {item.description}
                            </p>
                          )}
                          {/* ✅ Placeholder for invite button positioning */}
                          <div className="h-6"></div>
                        </div>
                      </div>
                    </AccordionTrigger>

                    {/* ✅ Invite Button - Absolute positioned at bottom left */}
                    <div
                      className="absolute left-5 bottom-3 z-10"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <InviteMemberToWorkshop item={item} />
                    </div>

                    {/* ✅ Delete Button - Absolute positioned at right center */}
                    <div className="absolute right-12 top-1/2 -translate-y-1/2 z-10">
                      <Popover
                        open={deletePopoverId === item._id}
                        onOpenChange={(open) =>
                          setDeletePopoverId(open ? item._id : null)
                        }
                      >
                        <PopoverTrigger
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 rounded-lg hover:bg-red-50 transition-colors duration-200"
                        >
                          <Trash2 className="w-4 h-4 text-red-500 hover:text-red-600" />
                        </PopoverTrigger>

                        <PopoverContent
                          align="end"
                          className="w-80"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-bold text-slate-900 mb-2">
                                Delete Workshop?
                              </h4>
                              <p className="text-sm text-slate-600 leading-relaxed">
                                Are you sure you want to delete{" "}
                                <strong className="text-slate-900">
                                  {item.name}
                                </strong>
                                ? This action cannot be undone.
                              </p>
                            </div>

                            {/* ✅ Button hierarchy: Cancel (secondary) + Delete (destructive) */}
                            <div className="flex gap-3">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDeletePopoverId(null);
                                }}
                                className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors duration-200"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteWorkshop(item._id, item.name);
                                }}
                                disabled={isDeleting}
                                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {isDeleting ? "Deleting..." : "Delete"}
                              </button>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  {/* Accordion Content */}
                  <AccordionContent className="px-5 pb-5 bg-slate-50 border-t border-slate-200">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Team Members ({totalMember?.allMember?.length || 0})
                        </p>
                      </div>

                      {/* Members List */}
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {totalMember?.allMember?.length > 0 ? (
                          totalMember.allMember.map((member) => (
                            <div
                              key={member._id}
                              className="bg-white py-3 px-4 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors duration-200 flex items-center justify-between"
                            >
                              <h1 className="font-medium text-slate-900">
                                {member.userId.name}
                              </h1>

                              <Popover
                                open={memberPopoverId === member._id}
                                onOpenChange={(open) =>
                                  setMemberPopoverId(open ? member._id : null)
                                }
                              >
                                <PopoverTrigger
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleMemberClick(member.userId._id);
                                  }}
                                  className="p-2 rounded-lg hover:bg-slate-100 transition-colors duration-200"
                                >
                                  <EllipsisVertical className="w-4 h-4 text-slate-600" />
                                </PopoverTrigger>

                                <PopoverContent
                                  align="end"
                                  className="w-80"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <div className="space-y-3">
                                    <h4 className="font-bold text-slate-900 mb-1">
                                      Assigned Tasks
                                    </h4>

                                    {/* ✅ Tasks list with proper spacing */}
                                    {taskAssignedToUser?.tasks?.length > 0 ? (
                                      <div className="space-y-2 max-h-48 overflow-y-auto">
                                        {taskAssignedToUser.tasks.map(
                                          (task, idx) => (
                                            <div
                                              key={idx}
                                              className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between gap-3"
                                            >
                                              <p className="text-sm font-medium text-slate-900 truncate flex-1 min-w-0">
                                                {task.title}
                                              </p>
                                              <button
                                                onClick={(e)=>{
                                              e.stopPropagation(),
                                              setAssignDialogOpen(true)
                                              setSelectedMemberForAssign(member);
                                            }}
                                              className="text-xs font-medium text-red-600 hover:text-red-700 whitespace-nowrap shrink-0 px-2 py-1 rounded hover:bg-red-50 transition-colors duration-200">
                                                Remove
                                              </button>
                                            </div>
                                          )
                                        )}
                                      </div>
                                    ) : (
                                      <p className="text-sm text-slate-500 py-3 text-center bg-slate-50 rounded-lg">
                                        No tasks assigned to this user
                                      </p>
                                    )}

                                    {/* ✅ Action buttons with clear hierarchy */}
                                    <div className="space-y-2 pt-2 border-t border-slate-200">
                                      <button
                                        className="w-full px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg transition-colors duration-200"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setSelectedMemberForAssign(member);
                                          setAssignDialogOpen(true);
                                        }}
                                      >
                                        Assign Taskdd
                                      </button>

                                      {/* ✅ Destructive action - Red color */}
                                      <button
                                        className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors duration-200"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setMemberPopoverId(null);
                                          setDeleteDialogMember(member);
                                        }}
                                      >
                                        Remove from Workshop
                                      </button>
                                    </div>
                                  </div>
                                </PopoverContent>
                              </Popover>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8 bg-white rounded-lg border-2 border-dashed border-slate-200">
                            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                            <p className="text-sm text-slate-500">
                              No members yet
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="bg-white border-2 border-dashed border-slate-200 rounded-xl p-12 text-center">
              <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 text-lg">
                No workspaces created yet
              </p>
              <button className="mt-4 px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg transition-colors duration-200">
                Create Workspace
              </button>
            </div>
          )}
        </div>

        {/* Invited Workspaces Section */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-6 h-6 text-slate-600" />
            <h2 className="text-2xl font-bold text-slate-900">
              Invited Workspaces
            </h2>
          </div>
          {invitedWorkshop?.workshops.length > 0 ? (
            <>
              {invitedWorkshop?.workshops.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition-all duration-200"
                  >
                    {/* Workshop Name */}
                    <h2 className="text-xl font-bold text-slate-900 mb-2">
                      {item.name}
                    </h2>

                    {/* Description */}
                    {item.description && (
                      <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                        {item.description}
                      </p>
                    )}

                    {/* Owner Info */}
                    <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                      <span className="text-xs font-medium text-slate-500">
                        Owner:
                      </span>
                      <span className="text-sm font-semibold text-slate-900">
                        {item.ownerId.name}
                      </span>
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            <>
              <div className="bg-white border-2 border-dashed border-slate-200 rounded-xl p-12 text-center">
                <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">No invited workspaces yet</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ✅ Delete Member Dialog - Clean and consistent */}
      <Dialog
        open={deleteDialogMember !== null}
        onOpenChange={(open) => !open && setDeleteDialogMember(null)}
      >
        <DialogContent onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>Remove Member from Workshop?</DialogTitle>
            <DialogDescription className="pt-3">
              Are you sure you want to remove{" "}
              <strong className="text-slate-900">
                {deleteDialogMember?.userId?.name}
              </strong>{" "}
              from this workshop? All their assigned tasks will be unassigned
              and tasks created by them will be deleted.
            </DialogDescription>
          </DialogHeader>

          {/* ✅ Consistent button hierarchy */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setDeleteDialogMember(null)}
              className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={() => removeUserFromWorkshopHandler(deleteDialogMember)}
              disabled={isRemovingMember}
              className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRemovingMember ? "Removing..." : "Remove Member"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
      {/* Task Assignment Dialog */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Assign Task to {selectedMemberForAssign?.userId?.name}
            </DialogTitle>
            <DialogDescription>
              Select a task from the workshop
            </DialogDescription>
          </DialogHeader>

          {/* Show all tasks in the workshop */}
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {workshopTasks?.map((task) => (
              <div
                key={task._id}
                className="p-3 border rounded-lg flex items-center justify-between hover:bg-slate-50"
              >
                <div>
                  <p className="font-medium">{task.title}</p>
                  <p className="text-xs text-slate-500">{task.description}</p>
                </div>

                <button
                  onClick={() =>
                    handleAssignTask(
                      task._id,
                      selectedMemberForAssign?.userId._id
                    )
                  }
                  disabled={isAssigning}
                  className="px-3 py-1 bg-slate-800 text-white rounded-lg text-sm disabled:opacity-50"
                >
                  {task.assignees?.includes(selectedMemberForAssign?.userId._id)
                    ? "Remove"
                    : "Assign"}
                </button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Settings;
