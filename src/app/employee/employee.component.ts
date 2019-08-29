import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { EmployeeService } from '../employee.service';
import { Employee } from '../employee';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {
  dataSaved = false;
  employeeForm: any;
  allEmployees: Observable<Employee[]>;
  employeeIdUpdate = null;
  massage = null;

  constructor(private formbulider: FormBuilder, private employeeService: EmployeeService) { }

  ngOnInit() {
    this.employeeForm = this.formbulider.group({
      EMPNAME: ['', [Validators.required]],
      DATEOFBIRTH: ['', [Validators.required]],
      EMAILID: ['', [Validators.required]],
      GENDER: ['', [Validators.required]],
      ADDRESS: ['', [Validators.required]],
      PINCODE: ['', [Validators.required]],
    });
    this.loadAllEmployees();
  }
  loadAllEmployees() {
    this.allEmployees = this.employeeService.getAllEmployee();
    debugger;
  }
  onFormSubmit() {
    this.dataSaved = false;
    const employee = this.employeeForm.value;
    this.CreateEmployee(employee);
    this.employeeForm.reset();
  }
  loadEmployeeToEdit(employeeId: string) {
    this.employeeService.getEmployeeById(employeeId).subscribe(employee => {
      this.massage = null;
      this.dataSaved = false;
      this.employeeIdUpdate = employee.EMPID;
      this.employeeForm.controls['EMPNAME'].setValue(employee.EMPNAME);
      this.employeeForm.controls['DATEOFBIRTH'].setValue(employee.DATEOFBIRTH);
      this.employeeForm.controls['EMAILID'].setValue(employee.EMAILID);
      this.employeeForm.controls['GENDER'].setValue(employee.GENDER);
      this.employeeForm.controls['ADDRESS'].setValue(employee.ADDRESS);
      this.employeeForm.controls['PINCODE'].setValue(employee.PINCODE);
    });

  }
  CreateEmployee(employee: Employee) {
    if (this.employeeIdUpdate == null) {
      this.employeeService.createEmployee(employee).subscribe(
        () => {
          this.dataSaved = true;
          this.massage = 'Record saved Successfully';
          this.loadAllEmployees();
          this.employeeIdUpdate = null;
          this.employeeForm.reset();
        }
      );
    } else {
      employee.EMPID = this.employeeIdUpdate;
      this.employeeService.updateEmployee(employee).subscribe(() => {
        this.dataSaved = true;
        this.massage = 'Record Updated Successfully';
        this.loadAllEmployees();
        this.employeeIdUpdate = null;
        this.employeeForm.reset();
      });
    }
  }
  deleteEmployee(employeeId: string) {
    if (confirm("Are you sure you want to delete this ?")) {
      this.employeeService.deleteEmployeeById(employeeId).subscribe(() => {
        this.dataSaved = true;
        this.massage = 'Record Deleted Succefully';
        this.loadAllEmployees();
        this.employeeIdUpdate = null;
        this.employeeForm.reset();

      });
    }
  }
  resetForm() {
    this.employeeForm.reset();
    this.massage = null;
    this.dataSaved = false;
  }
}  
