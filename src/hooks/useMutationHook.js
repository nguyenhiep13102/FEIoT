import { useMutation } from "@tanstack/react-query"

export const useMutationHooks = (fncallback ,options = {}) => {
    const mutation = useMutation({
        mutationFn : fncallback,
         ...options, 
    })
    return mutation;
}
export default  {
    useMutationHooks
} ;