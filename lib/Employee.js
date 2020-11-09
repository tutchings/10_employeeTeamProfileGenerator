// TODO: Write code to define and export the Employee class

class Employee {
    constructor(name, id, email) {
        this.name = name;
        this.role = 'Employee';
        this.id = id;
        this.email = email;
    }

    getName(){
        return this.name;
    }

    getRole() {
        return this.role;
    }

    getEmail() {
        return this.email;
    }

    getId(){
        return this.id;
    }
}

module.exports = Employee;