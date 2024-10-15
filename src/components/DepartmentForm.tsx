import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const DepartmentForm: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => {
      return axios.post('http://localhost:3000/api/departments', {
        name,
        description,
      });
    },
    onSettled(data, error) {
      if (data) {
        console.log('Department added:', data);
        setName('');
        setDescription('');
        queryClient.invalidateQueries({ queryKey: ["departments"] });
      }
      if (error) {
        console.error('Error adding department:', error);
      }
    },
    onError() {
        setError('Failed to add department. Please try again.');
    }
  });


  const addDepartment = async () => {
    setIsLoading(true);
    setError(null);
   mutation.mutate();
    setIsLoading(false);
  };

  return (
    <Card className="p-6 flex flex-col justify-between h-full space-y-4">
<div className="flex flex-col space-y-4">
<h3 className="text-lg font-bold">Add Department</h3>
      <Input 
        placeholder="Name" 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
      />
      <Input 
        placeholder="Description" 
        value={description} 
        onChange={(e) => setDescription(e.target.value)} 
      />
</div>
      <Button onClick={addDepartment} disabled={isLoading}>
        {mutation.isPending ? 'Adding...' : 'Add Department'}
      </Button>
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </Card>
  );
};

export default DepartmentForm;  