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

} //end class Empployee



//export Employee class
module.exports = Employee;