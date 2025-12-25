import { getSingleTaskApi, getTaskApi, getTasksAssignedToUser, updateStatusApi } from '@/Api/task.api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
export const useGetTask = (id) => {
  return useQuery({
    queryKey: ['getTask', id],
    queryFn: () => getTaskApi(id),
    enabled: !!id, // 🔥 IMPORTANT
  })
}


export const useUpdateStatusHook = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateStatusApi,
    onSuccess: () => {
      // 🔥 task list refresh
      toast.success("Task Updated")
      queryClient.invalidateQueries(["getTask"])
    },
    onError:(err)=>{
        console.log(err)
        toast.error(err.response.data.message)
    }
  })
}


export const useGetSingleTaskHook = (id)=>{
    return useQuery({
        queryKey:['getSingletask'],
        queryFn:()=>getSingleTaskApi(id),
        enabled:!!id
    })
}


export const useGetTaskAssignedToUser=  (id)=>{
  return useQuery({
    queryKey:['getTaskAssignedToUser', id],
    queryFn:()=>getTasksAssignedToUser(id),
    enabled:!!id
  })
}