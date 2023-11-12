import * as cl from '@clack/prompts';
import { setTimeout } from 'node:timers/promises';
import color from "picocolors";

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
    const re_pass = await cl.password({
        message: 'Please retype password for your account',
        validate: (value) => {
            if (!value) return 'Please enter the password you previously typed';
            if (value != password) return 'The password you typed does not match each other';
        },
    });
    if (cl.isCancel(re_pass)) {
        cl.cancel('Returning back to main menu');
        return "Restart";
    }

    user = {"username": username, "password": password}
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

async function main(){
    do {
        console.clear()
        cl.intro(`${color.bgCyan(color.black('Welcome to Workspace Manager app!'))}`);
        if (user == null){
            const account = await cl.select({
                message: 'Please log in/sign up our service 😍:',
                options: [
                { value: 'old', label: 'Log in 🔑', hint: "For those who have created an account before."},
                { value: 'new', label: 'Sign up 📃', hint: "You are new? Don't worry, just sign up and we will help you!" }
                ],
            });

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
}

main().catch(console.error);
