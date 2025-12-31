import { assignUserToTaskApi, createTask, deleteTask, getSingleTaskApi, getTaskApi, getTasksAssignedToUser, updateStatusApi } from '@/Api/task.api'
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


export const useAssignUserToTaskHook=()=>{
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn:assignUserToTaskApi,
    onSuccess:(data)=>{
      console.log(data),
      queryClient.invalidateQueries(['getTaskAssignedToUser'])
      toast.success(data.message)
    },
    onError:(err)=>{
      console.log(err)
    }
  })
}



export const useCreateTaskHook = ()=>{
  const queryClient  = useQueryClient()
  return useMutation({
    mutationFn:createTask,
    onSuccess:(data)=>{
      toast.success(data.message),
      // console.log(data)
      queryClient.invalidateQueries(['getTask'])
    },
    onError:(err)=>{
      console.log(err)
      toast.error(err?.response?.data?.message)
    }
  })
}


export const useDeleteTaskHook = ()=>{
  return useMutation({
    mutationFn:deleteTask,
    onSuccess:(data)=>{
      console.log(data.message)
    },
    onError:(err)=>{
      console.log(err)
    }

  })
}