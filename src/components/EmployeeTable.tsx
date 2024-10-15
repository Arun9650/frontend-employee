import { useState, useMemo } from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import useEmployee from "@/hooks/useEmployee";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

interface Employee {
  id: number;
  name: string;
  department: {
    id: number; 
    name: string;
  };
  address: string;
}

const EmployeeTable: React.FC = () => {
  const [filterName, setFilterName] = useState<string>('');
  const [filterDepartment, setFilterDepartment] = useState<string>('');

  const { data: employees, isLoading: isEmployeesLoading, error: employeesError } = useEmployee();

  const filteredEmployees = useMemo(() => {
    if (!employees) return [];
    return employees.data.filter((employee:Employee) => 
      employee.name.toLowerCase().includes(filterName.toLowerCase()) &&
      employee.department.name.toLowerCase().includes(filterDepartment.toLowerCase())
    );
  }, [employees, filterName, filterDepartment]);

  const { data: apiFilteredEmployees, isLoading: isFilterLoading, error: filterError, refetch: refetchFiltered } = useQuery({
    queryKey: ['filteredEmployees', filterName, filterDepartment],
    queryFn: async () => {
      const response = await axios.get<Employee[]>('http://localhost:3000/api/employees', {
        params: { name: filterName, department: filterDepartment },
      });
      return response.data;
    },
    enabled: false,
  });

  const handleFilter = () => {
    if (filteredEmployees.length === 0) {
      refetchFiltered();
    }
  };

  const displayedEmployees = apiFilteredEmployees || filteredEmployees;
  const isLoading = isEmployeesLoading || isFilterLoading;
  const error = employeesError || filterError;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <Input
          placeholder="Filter by name"
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
          className="mr-2"
        />
        <Input
          placeholder="Filter by department"
          value={filterDepartment}
          onChange={(e) => setFilterDepartment(e.target.value)}
          className="mr-2"
        />
        <Button onClick={handleFilter} disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Filter'}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Address</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayedEmployees?.map((employee: Employee) => (
            <TableRow key={employee.id}>
              <TableCell>{employee.name}</TableCell>
              <TableCell>{employee.department.name}</TableCell>
              <TableCell>{employee.address}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {displayedEmployees?.length === 0 && !isLoading && !error && (
        <p className="text-center mt-4">No employees found.</p>
      )}
    </Card>
  );
};

export default EmployeeTable;