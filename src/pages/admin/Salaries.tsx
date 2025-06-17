import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { Employee, getEmployees, updateEmployeeRate, calculateSalary, updateEmployee, deleteEmployee, addEmployee } from "@/services/adminService";
import { Calculator, DollarSign, Edit, Trash2, Plus } from "lucide-react";

const AdminSalaries = () => {
  const { t } = useLanguage();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");
  const [workingHours, setWorkingHours] = useState<number>(0);
  const [workingDays, setWorkingDays] = useState<number>(0);
  const [calculatedSalary, setCalculatedSalary] = useState<number | null>(null);
  const [calculatedDailySalary, setCalculatedDailySalary] = useState<number | null>(null);
  const [calculatedMonthlySalary, setCalculatedMonthlySalary] = useState<number | null>(null);
  
  const [isRateDialogOpen, setIsRateDialogOpen] = useState(false);
  const [selectedEmployeeForRate, setSelectedEmployeeForRate] = useState<Employee | null>(null);
  const [newHourlyRate, setNewHourlyRate] = useState<number>(0);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editEmployee, setEditEmployee] = useState<Employee | null>(null);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState({ name: '', position: '', hourlyRate: '' });

  useEffect(() => {
    if (!isAdmin) {
      toast({
        title: "Unauthorized",
        description: "You don't have permission to access this page",
        variant: "destructive",
      });
      navigate("/");
      return;
    }
    
    loadEmployees();
  }, [isAdmin, navigate, toast]);

  const loadEmployees = async () => {
    try {
      const data = await getEmployees();
      setEmployees(data);
    } catch (error) {
      console.error("Error loading employees:", error);
      toast({
        title: "Error",
        description: "Failed to load employee data",
        variant: "destructive",
      });
    }
  };

  const handleSetRate = (employee: Employee) => {
    setSelectedEmployeeForRate(employee);
    setNewHourlyRate(employee.hourlyRate);
    setIsRateDialogOpen(true);
  };

  const handleUpdateRate = async () => {
    if (!selectedEmployeeForRate) return;
    
    try {
      await updateEmployeeRate(selectedEmployeeForRate.id, newHourlyRate);
      
      toast({
        title: "Success",
        description: "Hourly rate updated successfully",
      });
      
      setIsRateDialogOpen(false);
      loadEmployees();
    } catch (error) {
      console.error("Error updating hourly rate:", error);
      toast({
        title: "Error",
        description: "Failed to update hourly rate",
        variant: "destructive",
      });
    }
  };

  const handleCalculate = async () => {
    if (!selectedEmployee || workingHours <= 0 || workingDays <= 0) {
      toast({
        title: "Error",
        description: "Please select an employee and enter valid working hours and working days",
        variant: "destructive",
      });
      return;
    }
    try {
      const employee = employees.find(e => e.id === selectedEmployee);
      if (!employee) return;
      const dailySalary = employee.hourlyRate * workingHours;
      const monthlySalary = dailySalary * workingDays;
      setCalculatedDailySalary(dailySalary);
      setCalculatedMonthlySalary(monthlySalary);
      setCalculatedSalary(null); // legacy, not used now
      toast({
        title: "Salary Calculated",
        description: `${t("admin.salaries.dailySalary")}: ${dailySalary} ${t("admin.tickets.currency")}, ${t("admin.salaries.monthlySalary")}: ${monthlySalary} ${t("admin.tickets.currency")}`,
      });
    } catch (error) {
      console.error("Error calculating salary:", error);
      toast({
        title: "Error",
        description: "Failed to calculate salary",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (employee: Employee) => {
    setEditEmployee(employee);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editEmployee) return;
    try {
      await updateEmployee(editEmployee.id, {
        name: editEmployee.name,
        position: editEmployee.position,
        hourlyRate: editEmployee.hourlyRate
      });
      toast({ title: t("admin.salaries.editSuccess"), description: t("admin.salaries.editSuccessDesc") });
      setIsEditDialogOpen(false);
      setEditEmployee(null);
      loadEmployees();
    } catch (error) {
      toast({ title: t("admin.salaries.editFail"), description: t("admin.salaries.editFailDesc"), variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteEmployee(id);
      toast({ title: t("admin.salaries.deleteSuccess"), description: t("admin.salaries.deleteSuccessDesc") });
      loadEmployees();
    } catch (error) {
      toast({ title: t("admin.salaries.deleteFail"), description: t("admin.salaries.deleteFailDesc"), variant: "destructive" });
    }
  };

  const handleAddEmployee = async () => {
    try {
      await addEmployee({
        name: newEmployee.name,
        position: newEmployee.position,
        hourlyRate: newEmployee.hourlyRate === '' ? 0 : Number(newEmployee.hourlyRate)
      });
      toast({ title: t("admin.salaries.addSuccess"), description: t("admin.salaries.addSuccessDesc") });
      setIsAddDialogOpen(false);
      setNewEmployee({ name: '', position: '', hourlyRate: '' });
      loadEmployees();
    } catch (error) {
      toast({ title: t("admin.salaries.addFail"), description: t("admin.salaries.addFailDesc"), variant: "destructive" });
    }
  };

  if (!isAdmin) {
    return null;
  }

  const selectedEmployeeData = employees.find(e => e.id === selectedEmployee);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gray-50 py-12">
        <div className="theatre-container">
          <h1 className="text-3xl font-bold text-theatre-burgundy mb-8">{t("admin.salaries.title")}</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>{t("admin.salaries.calculateTitle")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="employeeSelect">{t("admin.salaries.employee")}</Label>
                      <Select 
                        value={selectedEmployee} 
                        onValueChange={setSelectedEmployee}
                      >
                        <SelectTrigger id="employeeSelect">
                          <SelectValue placeholder="Select an employee" />
                        </SelectTrigger>
                        <SelectContent>
                          {employees.map((employee) => (
                            <SelectItem key={employee.id} value={employee.id}>
                              {employee.name} ({employee.position})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="workingHours">{t("admin.salaries.hours")}</Label>
                      <Input
                        id="workingHours"
                        type="number"
                        min="0"
                        step="0.5"
                        value={workingHours || ""}
                        onChange={(e) => setWorkingHours(Number(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="workingDays">{t("admin.salaries.workingDays")}</Label>
                      <Input
                        id="workingDays"
                        type="number"
                        min="0"
                        step="1"
                        value={workingDays || ""}
                        onChange={(e) => setWorkingDays(Number(e.target.value))}
                      />
                    </div>
                  </div>
                  
                  {selectedEmployeeData && (
                    <div className="bg-gray-50 p-4 rounded-md">
                      <p className="text-sm text-gray-500 mb-1">{t("admin.salaries.currentHourlyRate")}</p>
                      <p className="font-bold">{selectedEmployeeData.hourlyRate} {t("admin.tickets.currency")}</p>
                    </div>
                  )}
                  
                  <Button 
                    onClick={handleCalculate}
                    className="mt-4 bg-theatre-burgundy hover:bg-theatre-burgundy/90"
                    disabled={!selectedEmployee || workingHours <= 0 || workingDays <= 0}
                  >
                    <Calculator className="mr-2 h-4 w-4" />
                    {t("admin.salaries.calculate")}
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {calculatedDailySalary !== null && calculatedMonthlySalary !== null && (
              <Card>
                <CardHeader>
                  <CardTitle>{t("admin.salaries.total")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-left">
                    <div className="text-lg font-bold text-theatre-burgundy mb-2">
                      {t("admin.salaries.dailySalary")}: {calculatedDailySalary} {t("admin.tickets.currency")}
                    </div>
                    <div className="text-lg font-bold text-theatre-burgundy">
                      {t("admin.salaries.monthlySalary")}: {calculatedMonthlySalary} {t("admin.tickets.currency")}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          
          <div className="flex justify-end mb-4">
            <Button onClick={() => setIsAddDialogOpen(true)} className="bg-theatre-burgundy text-white">
              <Plus className="mr-2 h-4 w-4" />{t("admin.salaries.addEmployee")}
            </Button>
          </div>
          
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("admin.salaries.name")}</TableHead>
                  <TableHead>{t("admin.salaries.position")}</TableHead>
                  <TableHead>{t("admin.salaries.rate")} ({t("admin.tickets.currency")})</TableHead>
                  <TableHead className="w-[150px]">{t("admin.tickets.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium">{employee.name}</TableCell>
                    <TableCell>{employee.position}</TableCell>
                    <TableCell>{employee.hourlyRate}</TableCell>
                    <TableCell className="flex gap-2">
                      <Button onClick={() => handleEdit(employee)} variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />Edit
                      </Button>
                      <Button onClick={() => handleDelete(employee.id)} variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4 mr-2" />Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                
                {employees.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                      No employees found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
      
      <Footer />
      
      {/* Set Hourly Rate Dialog */}
      <Dialog open={isRateDialogOpen} onOpenChange={setIsRateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("admin.salaries.setHourlyRate")}</DialogTitle>
          </DialogHeader>
          
          {selectedEmployeeForRate && (
            <div className="py-4">
              <p className="mb-4">
                {t("admin.salaries.setHourlyRateEmployee")} <span className="font-bold">{selectedEmployeeForRate.name}</span>
              </p>
              
              <div className="space-y-2">
                <Label htmlFor="hourlyRate">{t("admin.salaries.rate")} ({t("admin.tickets.currency")})</Label>
                <Input
                  id="hourlyRate"
                  type="number"
                  min="0"
                  step="10"
                  value={newHourlyRate || ""}
                  onChange={(e) => setNewHourlyRate(Number(e.target.value))}
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsRateDialogOpen(false)}
            >
              {t("admin.salaries.cancelButton")}
            </Button>
            <Button 
              onClick={handleUpdateRate}
              className="bg-theatre-burgundy hover:bg-theatre-burgundy/90"
            >
              {t("admin.salaries.saveRateButton")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Employee Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("admin.salaries.editEmployee")}</DialogTitle>
          </DialogHeader>
          {editEmployee && (
            <form className="space-y-4" onSubmit={e => { e.preventDefault(); handleSaveEdit(); }}>
              <div>
                <Label>{t("admin.salaries.name")}</Label>
                <Input value={editEmployee.name} onChange={e => setEditEmployee({ ...editEmployee, name: e.target.value })} required />
              </div>
              <div>
                <Label>{t("admin.salaries.position")}</Label>
                <Input value={editEmployee.position} onChange={e => setEditEmployee({ ...editEmployee, position: e.target.value })} required />
              </div>
              <div>
                <Label>{t("admin.salaries.rate")}</Label>
                <Input type="number" value={editEmployee.hourlyRate === 0 ? '' : String(editEmployee.hourlyRate)} onChange={e => setEditEmployee({ ...editEmployee, hourlyRate: e.target.value === '' ? 0 : Number(e.target.value) })} required />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>{t("admin.salaries.cancelButton")}</Button>
                <Button type="submit" className="bg-theatre-burgundy text-white">{t("admin.salaries.saveButton")}</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Add Employee Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("admin.salaries.addEmployee")}</DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={e => { e.preventDefault(); handleAddEmployee(); }}>
            <div>
              <Label>{t("admin.salaries.name")}</Label>
              <Input value={newEmployee.name} onChange={e => setNewEmployee({ ...newEmployee, name: e.target.value })} required />
            </div>
            <div>
              <Label>{t("admin.salaries.position")}</Label>
              <Input value={newEmployee.position} onChange={e => setNewEmployee({ ...newEmployee, position: e.target.value })} required />
            </div>
            <div>
              <Label>{t("admin.salaries.rate")}</Label>
              <Input type="number" value={newEmployee.hourlyRate} onChange={e => setNewEmployee({ ...newEmployee, hourlyRate: e.target.value })} required />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>{t("admin.salaries.cancelButton")}</Button>
              <Button type="submit" className="bg-theatre-burgundy text-white">{t("admin.salaries.saveButton")}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminSalaries;
