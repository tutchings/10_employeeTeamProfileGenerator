//node requirements
const Employee = require("./employee");



class Intern extends Employee {
    constructor(name, id, email, school){
        super(name, id, email);
        this.school = school;
    }

    getSchool() {
        return this.school;
    }

    getRole() {
        return 'Intern';
    }

} //end class Intern



//export Intern class
module.exports = Intern;