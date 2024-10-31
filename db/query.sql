SELECT * FROM department;

SELECT roles.id, roles.title, department.name as department,roles.salary
FROM roles
JOIN department
ON department.id=roles.department_id;

 
SELECT employee.id, employee.first_name,employee.last_name,
roles.title, department.name as department, roles.salary, CONCAT(employee_manager.first_name,' ' ,   employee_manager.last_name) as manager

FROM employee
LEFT JOIN roles ON roles.id = employee.roles_id
LEFT JOIN department ON department.id = roles.department_id
LEFT JOIN employee as employee_manager ON employee.manager_id=employee_manager.id order by employee.id;
