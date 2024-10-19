import React, { useState } from 'react';
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
import { Label } from './ui/label';
import axios from 'axios';
import useDepartments from '@/hooks/useDepartments';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const EmployeeForm: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [departmentId, setDepartmentId] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [pancardImage, setPancardImage] = useState<File | null>(null);

  const queryClient = useQueryClient();
  const { data: departments, error } = useDepartments();

  const mutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('department_id', departmentId);
      formData.append('address', address);
      if (pancardImage) {
        formData.append('pancard_image', pancardImage);
      }

      return axios.post('http://localhost:3000/api/employees', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
    onSettled(data, error) {
      if (data) {
        console.log('Employee added:', data);
        setName('');
        setDepartmentId('');
        setAddress('');
        setPancardImage(null);
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setPancardImage(event.target.files[0]);
    }
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
          {departments?.rows?.map((dept: { id: number; name: string }) => (
            <SelectItem key={dept.id} value={dept.id.toString()}>
              {dept.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input 
        placeholder="Address" 
        value={address} 
        onChange={(e) => setAddress(e.target.value)} 
      />
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="picture">PAN Card Image</Label>
        <Input id="picture" type="file" onChange={handleFileChange} />
      </div>
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