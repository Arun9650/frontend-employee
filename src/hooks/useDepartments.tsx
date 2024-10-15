import { useQuery } from "@tanstack/react-query"



const useDepartments = () => {
 return    useQuery({
        queryKey: ['departments'],
        queryFn: async () => {
            const res = await fetch('http://localhost:3000/api/departments')
            const data = await res.json()
            return data
        }
    })
}

export default useDepartments;