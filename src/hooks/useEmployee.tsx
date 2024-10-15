import { useQuery } from "@tanstack/react-query"
import axios from "axios"

const useEmployee = () => {
 return    useQuery({
        queryKey: ['employee'],
        queryFn: async () => {
            const data = await axios.get('http://localhost:3000/api/employees')
            return data
        }
    })
}

export default useEmployee;