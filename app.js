const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const util = require('util');

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

const writeHTML = util.promisify(fs.writeFile);

const employeeTypes = ['Manager', 'Engineer', 'Intern'];
let addAnotherEmployee = true;
let employeeArray = [];


// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

const promptEmployeeType = () => {
    return inquirer.prompt([
        {
            type: 'list',
            message: 'Select a type of employee to add to the Employee Team Profile',
            name: 'employeeType',
            choices: employeeTypes
        }
    ]);
} // end function prompt EmployeeType

const globalEmployeePrompts = () => {
    return inquirer.prompt([
        {
            type: 'input',
            message: 'Name: ',
            name: 'name'
        },
        {
            type: 'input',
            message: 'ID: ',
            name: 'id'
        },
        {
            type: 'input',
            message: 'Email: ',
            name: 'email'
        }
    ]);
} //end function employeePrompts()

const specificEmployeePrompts = (employeeTypeResponse) => {

    const employeeType = employeeTypeResponse.employeeType;

    if (employeeType === 'Manager'){
        return inquirer.prompt([
            {
                type: 'input',
                message: 'Office Number: ',
                name: 'officeNumber'
            }
        ]);
    } else if (employeeType === 'Engineer'){
        return inquirer.prompt([
            {
                type: 'input',
                message: 'GitHub Username: ',
                name: 'github'
            }
        ]);
    } else if (employeeType === 'Intern'){
        return inquirer.prompt([
            {
                type: 'input',
                message: 'School: ',
                name: 'school'
            }
        ]);
    }
} //end function specificEmployeePrompts()

const anotherEmployee  = () => {
    return inquirer.prompt([
        {
            type: 'confirm',
            message: 'Do you want to add another employee team member? ',
            name: 'addEmployee'
        }
    ]);
}

const createEmployeeObject = (employeeTypeResponse, globalPromptResponse, specificPromptResponse) => {
    const employeeType = employeeTypeResponse.employeeType;

    if(employeeType === 'Manager'){
        const manager = new Manager (globalPromptResponse.name, globalPromptResponse.id, globalPromptResponse.email, specificPromptResponse.officeNumber);
        employeeArray.push(manager);
    } else if(employeeType === 'Engineer'){
        const engineer = new Engineer (globalPromptResponse.name, globalPromptResponse.id, globalPromptResponse.email, specificPromptResponse.github);
        employeeArray.push(engineer);
    } else if(employeeType === 'Intern'){
        const intern = new Intern (globalPromptResponse.name, globalPromptResponse.id, globalPromptResponse.email, specificPromptResponse.school);
        employeeArray.push(intern);
    }
}

async function init() {

    try {

        while(addAnotherEmployee){
            const employeeTypeResponse = await promptEmployeeType();
        
            const globalPromptResponse = await globalEmployeePrompts();
            
            const specificPromptResponse = await specificEmployeePrompts(employeeTypeResponse);

            await createEmployeeObject(employeeTypeResponse, globalPromptResponse, specificPromptResponse);

            const anotherEmployeeResponse = await anotherEmployee();
    
            if(!anotherEmployeeResponse.addEmployee){
                addAnotherEmployee = false;
            }
        }

    } catch(err) {
        console.log(err);
    } //end try/catch

} //end async function init()





// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!


// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

async function writeHTMLFile() {
    await init();

    const html = render(employeeArray);

    if (!fs.existsSync('./output')){
        fs.mkdir('./output', function(err) {
            if (err) {
                console.log(err);
            }
        });
    }
    
    await writeHTML('./output/team.html', html);
}




// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```

writeHTMLFile();