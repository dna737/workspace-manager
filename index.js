import * as cl from '@clack/prompts';
import color from "picocolors";
import * as child from 'child_process';
import uploadData from './backend/sendToDatabase.js';

let user = null
let response = null

async function accountCreation(){
    cl.intro(`${color.bgYellow(color.red('Great, let start the account creation:'))}`);
    const username = await cl.text({ 
        message: 'What is your username:',
        validate(value){
            if (value.length === 0) return `Username is required!`;
        }, 
    });
    if (cl.isCancel(username)) {
        cl.cancel('Operation cancelled.');
        return "Restart";
    }

    const password = await cl.password({
        message: 'Please provide password for your account (5 characters min)',
        validate: (value) => {
            if (!value) return 'Please enter a password.';
            if (value.length < 5) return 'Password should have at least 5 characters.';
        },
    });
    if (cl.isCancel(password)) {
        cl.cancel('Operation cancelled.');
        return "Restart";
    }
    user = {"username": username, "password": password}
    uploadData(user, "users")
    return "OK";
}

async function accountLogIn(){
    cl.intro(`${color.bgYellow(color.red('Welcome back! Please input the following info:'))}`);
    const username = await cl.text({ 
        message: 'What is your username:',
        validate(value){
            if (value.length === 0) return `Username is required!`;
        }, 
    });
    if (cl.isCancel(username)) {
        cl.cancel('Operation cancelled.');
        return "Restart";
    }

    const password = await cl.password({
        message: 'Please provide password for your account (5 characters min)',
        validate: (value) => {
            if (!value) return 'Please enter a password.';
            if (value.length < 5) return 'Password should have at least 5 characters.';
        },
    });
    if (cl.isCancel(password)) {
        cl.cancel('Operation cancelled.');
        return "Restart";
    }
    user = {"username": username, "password": password}
    return "OK";
}

async function menu(){
    do {
        console.clear()
        cl.intro(`${color.bgCyan(color.black('Welcome to Workspace Manager app!'))}`);
        if (user == null){
            const account = await cl.select({
                message: 'Please log in/sign up our service 😍:',
                options: [
                { value: 'old', label: 'Log in 🔑', hint: "For those who have created an account before."},
                { value: 'new', label: 'Sign up 📃', hint: "Newbie? Don't worry, just sign up and we will help you!" }
                ],
            });

            if (cl.isCancel(account)) {
                cl.outro(`${color.bgBlue(color.white('Goodbye! -Madhacks Team-'))}`);
                process.exit(0);
            }

            if (account == "new"){
                response = await accountCreation();
                cl.outro(`You're all set!`);
            }
            else {
                response = await accountLogIn();
                cl.outro(`You're all set!`);
            }
        } else 
            break;
    } while (response != "OK")

    await main()
}

async function main(){
    console.clear()
    cl.intro(`${color.bgCyan(color.black("Let's get productive today, " + user["username"] + "💪!"))}`);
    const workspaces = [];

    const options = ["HI"]
    workspaces.forEach((workspace) => {
        options.push({value: workspace, label: workspace})
    })

    const answer = await cl.select({
        message: "Which workspace do you want to open?",
        initialValue: '1',
        options: options,
    })
    /** 
    child.exec(`"C:\\Users\\kitty\\Downloads\\Midterm 2 - CS320.pdf"`, (err, stdout, stderr) => {
      if (err) {
        console.error(`exec error: ${err}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
    });*/
    child.exec('powershell.exe -NoProfile -ExecutionPolicy Bypass -File chooseFile.ps1', (err, stdout, stderr) => {
        if (err) {
            console.error(`Error: ${err}`);
            return;
        }
        if (stderr) {
            console.error(`Stderr: ${stderr}`);
            return;
        }
        const files = stdout.trim().split('\n');
        console.log(`Selected files:`, files);
    });

    
}

menu().catch(console.error);