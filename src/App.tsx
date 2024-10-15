import DepartmentForm from "./components/DepartmentForm";
import EmployeeForm from "./components/EmployeeForm";
import EmployeeTable from "./components/EmployeeTable";


function App() {
  return (
    <div className="p-4 grid grid-cols-2 gap-4">
      <div className="col-span-1 ">
        <DepartmentForm />
      </div>
      <div className="col-span-1">
        <EmployeeForm />
      </div>
      <div className="col-span-2 mt-4">
        <EmployeeTable />
      </div>
      
    </div>
  );
}

export default App;
