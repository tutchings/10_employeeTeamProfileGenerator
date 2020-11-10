//node requirements
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

//promisify writeFile
const writeHTML = util.promisify(fs.writeFile);

//global variable declarations
const employeeTypes = ['Manager', 'Engineer', 'Intern'];
let addAnotherEmployee = true;
let employeeArray = [];



//function to prompt the user for the type of employee to add to the employee team
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



//function that asks the user global employee prompts (those that are shared between all employees, regardless of the employee type)
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



//function that asks the user specific employee prompts (those that are specific to the employee type)
//the function accepts the response from the promptEmployeeType() function as its argument
const specificEmployeePrompts = (employeeTypeResponse) => {

    //sets employeeType variable equal to the employee type returned from the promptmployeeType() function
    const employeeType = employeeTypeResponse.employeeType;

    //asks the user a prompt based on the employee type returned from the promptEmployeeType() function
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
    } //end if/else conditional

} //end function specificEmployeePrompts()



//function that prompts the user if they want to add another employee to the employee team
const anotherEmployee  = () => {
    return inquirer.prompt([
        {
            type: 'confirm',
            message: 'Do you want to add another employee team member? ',
            name: 'addEmployee'
        }
    ]);
}



//function that accepts the responses from the previous three functions as arguments and creates employee objects based on the responses.
const createEmployeeObject = (employeeTypeResponse, globalPromptResponse, specificPromptResponse) => {

    //sets employeeType variable equal to the employee type returned from the promptmployeeType() function
    const employeeType = employeeTypeResponse.employeeType;


    //creates a new employee object based on the employee type that was returned from the promptEmployeeType() function
    //uses the manager, engineer, and intern classes (all of which depend on the employee class) to create employee objects
    //pushes the created employee object to the employeeArray
    if(employeeType === 'Manager'){
        const manager = new Manager (globalPromptResponse.name, globalPromptResponse.id, globalPromptResponse.email, specificPromptResponse.officeNumber);
        employeeArray.push(manager);
    } else if(employeeType === 'Engineer'){
        const engineer = new Engineer (globalPromptResponse.name, globalPromptResponse.id, globalPromptResponse.email, specificPromptResponse.github);
        employeeArray.push(engineer);
    } else if(employeeType === 'Intern'){
        const intern = new Intern (globalPromptResponse.name, globalPromptResponse.id, globalPromptResponse.email, specificPromptResponse.school);
        employeeArray.push(intern);
    } //end if/else conditional

} //end createEmployeeObject() function




async function init() {

    try {

        //while loop that runs the following code whenever user wants to add a new employee team profile
        while(addAnotherEmployee){

            //runs the promptEmployeeType() function and stores response in employeeTypeResponse variable
            const employeeTypeResponse = await promptEmployeeType();

            //runs the globalEmployeePrompts() function and stores response in globalPromptResponse variable
            const globalPromptResponse = await globalEmployeePrompts();

            //runs the specificEmployeePrompts() function and stores response in specificPromptResponse variable
            const specificPromptResponse = await specificEmployeePrompts(employeeTypeResponse);

            //passes the responses from the previous three functions to the createEmployeeObject() function 
            //createEmployeeObject function creates an employee object based on the responses passed to the function then pushes the created object to the employeeArray
            await createEmployeeObject(employeeTypeResponse, globalPromptResponse, specificPromptResponse);

            //runs the anotherEmployee() function and stores the response in anotherEmployeeResponse variable
            const anotherEmployeeResponse = await anotherEmployee();
    
            //if anotherEmployeeResponse.addEmployee === false, set addAnotherEmployee variable equal to false which breaks out of the while loop
            if(!anotherEmployeeResponse.addEmployee){
                addAnotherEmployee = false;
            }

        } //end while loop

    } catch(err) {
        console.log(err);
    } //end try/catch

} //end async function init()



async function writeHTMLFile() {

    //ensures init() function completel runs before running any subsequent code
    await init();

    //passes employeeArray to render function which renders html based on the employee team the user input
    //saves rendered html in html variable
    const html = render(employeeArray);

    //if an output folder does not exist in the project directory, create an output folder
    if (!fs.existsSync('./output')){
        fs.mkdir('./output', function(err) {
            if (err) {
                console.log(err);
            }
        });
    } //end if conditional
    
    //write the html to team.html and store file in the output folder
    await writeHTML('./output/team.html', html);

} //end async function writeHTMLFile()



//runs code for the program
writeHTMLFile();