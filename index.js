import * as cl from '@clack/prompts';
import color from "picocolors";
import * as child from 'child_process';
import uploadData from './backend/sendToDatabase.js';
import { setTimeout } from 'node:timers/promises';

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
    user = {"username": username, "password": password, "workspaces": []}
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

    await main(true)
}

function selectFiles() {
    return new Promise((resolve, reject) => {
        child.exec('powershell.exe -NoProfile -ExecutionPolicy Bypass -File chooseFile.ps1', (err, stdout, stderr) => {
            if (err) {
                reject(err);
                return;
            }
            if (stderr) {
                reject(stderr);
                return;
            }
            resolve(stdout.trim().split('\n'));
        });
    });
}

async function workspaceCreation(){
    const name = await cl.text({ 
        message: 'Please enter your first workspace 💻',
        validate(value){
            if (value.length === 0) return `Workspace is required!`;
        }, 
    });
    const s = cl.spinner();
    const files = null;
    s.start('Now, please put in all the files you need for the workspaces (pdf, docx, java, etc.). A dialog should open soon');
    
    try {
        const files = await selectFiles();
        s.stop();
        return {"workspaceName" : name, "paths": files}
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

async function main(newUser = false){
    let newSpace = null
    console.clear()
    cl.intro(`${color.bgCyan(color.black("Let's get productive today, " + user["username"] + "💪!"))}`);

    if (newUser == true){ //new user
        newSpace = await workspaceCreation()
        console.log(`Selected files:`, newSpace);
        user["workspaces"].push(newSpace["workspaceName"])
        uploadData(user, "users") //upload the user data with the first workspace to MongoDB
        uploadData(newSpace, "workspaces") //upload the workspaces data to MongoDB
    }

    const workspaces = user["workspaces"];
    const options = []

    workspaces.forEach((workspace) => {
        options.push({value: workspace, label: workspace})
    })

    const answer = await cl.select({
        message: "Which workspace do you want to open?",
        initialValue: '1',
        options: options,
    })
    for (let i = 0; i < newSpace["paths"].length; i++) {
        const cmd = `start "" "` + newSpace["paths"][i].replaceAll("\\","\\\\") +  `"`
        console.log(cmd)
        child.exec(cmd, (err, stdout, stderr) => {
        if (err) {
            console.error(`exec error: ${err}`);
            return;
        }
        //console.log(`stdout: ${stdout}`);
        //console.error(`stderr: ${stderr}`);
        });
    }
    /** 
    child.exec(`start "" "C:\\Users\\kitty\\Downloads\\Midterm 2 - CS320.pdf"`, (err, stdout, stderr) => {
      if (err) {
        console.error(`exec error: ${err}`);
        return;
      }
      //console.log(`stdout: ${stdout}`);
      //console.error(`stderr: ${stderr}`);
    });*/
}

menu().catch(console.error);