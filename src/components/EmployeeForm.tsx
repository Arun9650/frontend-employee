import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from "@/components/ui/alert";
import {  useState } from 'react';
import axios from 'axios';
import useDepartments from '@/hooks/useDepartments';
import { useMutation, useQueryClient } from '@tanstack/react-query';


const EmployeeForm: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [departmentId, setDepartmentId] = useState<string>('');
  const [address, setAddress] = useState<string>('');

  const queryClient = useQueryClient();

    const {data:departments, error} = useDepartments();
    console.log("🚀 ~ departments:", departments)


  const mutation = useMutation({
    mutationFn: () => {
      return axios.post('http://localhost:3000/api/employees', {
        name,
        department_id: parseInt(departmentId),
        address,
      });
    },

    onSettled(data, error) {
      if (data) {
        console.log('Employee added:', data);
        setName('');
        setDepartmentId('');
        setAddress('');
      }
      if (error) {
        console.error('Error adding employee:', error);
      }
      queryClient.invalidateQueries({ queryKey: ["employee"] });

    },


    onError() {
      console.error('Error adding employee');
    },

  });


  const addEmployee = async () => {
    mutation.mutate();    
  };

  return (
    <Card className="p-6 flex flex-col space-y-4">
      <h3 className="text-lg font-bold">Add Employee</h3>
      <Input 
        placeholder="Name" 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
      />
      <Select value={departmentId} onValueChange={setDepartmentId}>
        <SelectTrigger>
          <SelectValue placeholder="Select a department" />
        </SelectTrigger>
        <SelectContent>
          {departments?.rows?.map((dept: { id: number; name: string;}) => {
            console.log('akljfaklsdjf',dept)
            return (
                
                    <SelectItem key={dept.id} value={dept.id.toString()}>
                      {dept.name}
                    </SelectItem>
            )
          })}
        </SelectContent>
      </Select>
      <Input 
        placeholder="Address" 
        value={address} 
        onChange={(e) => setAddress(e.target.value)} 
      />
      <Button onClick={addEmployee} disabled={mutation.isPending}>
        {mutation.isPending ? 'Adding...' : 'Add Employee'}
      </Button>
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}
    </Card>
  );
};

export default EmployeeForm;