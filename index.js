import * as cl from "@clack/prompts";
import color from "picocolors";
import * as child from "child_process";
import uploadData from "./backend/sendToDatabase.js";
import { setTimeout } from "node:timers/promises";
import retrieveData from "./backend/backend.js";
import retrieveUserData from "./backend/retrieveUserData.js";

let user = null;
let response = null;

async function accountCreation() {
    cl.intro(
        `${color.bgYellow(color.red("Great, let start the account creation:"))}`
    );
    const username = await cl.text({
        message: "What is your username:",
        validate(value) {
            if (value.length === 0) return `Username is required!`;
        },
    });
    if (cl.isCancel(username)) {
        cl.cancel("Operation cancelled.");
        return "Restart";
    }

    const password = await cl.password({
        message: "Please provide password for your account (5 characters min)",
        validate: (value) => {
            if (!value) return "Please enter a password.";
            if (value.length < 5)
                return "Password should have at least 5 characters.";
        },
    });
    if (cl.isCancel(password)) {
        cl.cancel("Operation cancelled.");
        return "Restart";
    }
    user = { username: username, password: password};
    return "OK";
}

async function accountLogIn() {
    cl.intro(
        `${color.bgYellow(
            color.red("Welcome back! Please input the following info:")
        )}`
    );
    let checkExist = false
    do{
        const username = await cl.text({
            message: "What is your username:",
            validate(value) {
                if (value.length === 0) return `Username is required!`;
            },
        });
        if (cl.isCancel(username)) {
            cl.cancel("Operation cancelled.");
            return "Restart";
        }

        const password = await cl.password({
            message: "Please provide password for your account (5 characters min)",
            validate: (value) => {
                if (!value) return "Please enter a password.";
                if (value.length < 5)
                    return "Password should have at least 5 characters.";
            },
        });
        if (cl.isCancel(password)) {
            cl.cancel("Operation cancelled.");
            return "Restart";
        }

        checkExist = await retrieveUserData(username, password)
        if (!checkExist)
            cl.outro("Username or password is incorrect, please try again 🥺.")
    } while (!checkExist)
    user = { username: username, password: password};
    return "OK";
}

const reset = () => {
    user = null
    response = null
}

async function menu() {
    do {
        reset()
        let newUser = null;
        console.clear();
        cl.intro(
            `${color.bgCyan(color.black("Welcome to Workspace Manager app!"))}`
        );
        if (user == null) {
            const account = await cl.select({
                message: "Please log in/sign up our service 😍:",
                options: [
                    {
                        value: "old",
                        label: "Log in 🔑",
                        hint: "For those who have created an account before.",
                    },
                    {
                        value: "new",
                        label: "Sign up 📃",
                        hint: "Newbie? Don't worry, just sign up and we will help you!",
                    },
                    {
                        value: "exit",
                        label: "Exit the application 🚪",
                        hint: "Need to leave?",
                    }
                ],
            });

            if (cl.isCancel(account) || account == "exit") {
                cl.outro(
                    `${color.bgBlue(color.white("Goodbye! -Madhacks Team-"))}`
                );
                process.exit(0);
            }

            if (account == "new") {
                response = await accountCreation();
                newUser = true
            } else {
                response = await accountLogIn();
                newUser = false
            }
            if (response === "OK"){
                cl.outro(`You're all set!`);
                await main(newUser);
            }
        }
    } while (true);
}

function selectFiles() {
    return new Promise((resolve, reject) => {
        child.exec(
            "powershell.exe -NoProfile -ExecutionPolicy Bypass -File chooseFile.ps1",
            (err, stdout, stderr) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (stderr) {
                    reject(stderr);
                    return;
                }
                resolve(stdout.trim().split("\n"));
            }
        );
    });
}

async function main(newUser = false) {
    async function workspaceCreation() {
        const name = await cl.text({
            message: "Please enter the name for your workspace 💻",
            validate(value) {
                if (value.length === 0) return `Workspace is required!`;
            },
        });
        const files = null;
        cl.note("Now, please put in all the files you need for the workspaces (pdf, docx, java, etc.). A dialog should open soon", 'Next steps');
        try {
            const files = await selectFiles();
            return { workspaceName: name, paths: files };
        } catch (error) {
            console.error("An error occurred:", error);
        }
    }

    async function workspaceOpen(){
        const options = [{value: "goBack", label: "Go back ↩️"}];

        workspaces.forEach((workspace) => {
            options.push({ value: workspace, label: workspace });
        });

        const workspaceChoose = await cl.select({
            message: "Which workspace do you want to open?",
            initialValue: "1",
            options: options,
        });

        if (workspaceChoose === "goBack") //skip opening part
            return
            
        cl.outro("Opening...")
        for (let i = 0; i < newSpace["paths"].length; i++) {
            const cmd =
                `start "" "` + newSpace["paths"][i].replaceAll("\\", "\\\\") + `"`;
            console.log(cmd);
            child.exec(cmd, (err, stdout, stderr) => {
                if (err) {
                    console.error(`exec error: ${err}`);
                    return;
                }
                //console.log(`stdout: ${stdout}`);
                //console.error(`stderr: ${stderr}`);
            });
        }
        cl.outro("Open successfully!")
        setTimeout(2000)
    }
    let newSpace = null;
    let workspaces = []

    console.clear();
    cl.intro(
        `${color.bgCyan(
            color.black(
                "Let's get productive today, " + user["username"] + "💪!"
            )
        )}`
    );

    if (newUser == false){
        //getting the created workspaces
        workspaces = retrieveData(user["username"], "users")
    }

    while (true){
        const operation = [
            { value: "newWork", label: "Create a new workspace 🆕"},
            { value: "openWork", label: "Open an exisitng workspace 💻" },
            { value: "signOut", label: "Sign out 🔑"}
        ]

        if (newUser == false){
            if (workspaces.length == 0){ //user never created one
                operation.splice(1, 1);
            }
        } else { //new user so no previous workspace
            operation.splice(1, 1);
            cl.note("Welcome to your very own work-universe 🌌\n" +
                   "Here you can create a workspace each for your task!\n" + 
                   "Whether it's an essay with multiple pdf sources to work on to a complicated in-class coding project,\n" + 
                   "you just need to create one and put all of your files needed, and DONE! =D\n" +
                   "Have fun and be productive!",  '⭐ GETTING STARTED ⭐');
        }

        const opAnswer = await cl.select({
            message: "What do you want to do today?",
            initialValue: "1",
            options: operation,
        });

        switch (opAnswer) {
            default: //Create new workspace
                newUser = false //new or old user become old when created new workspace
                newSpace = await workspaceCreation();
                workspaces.push(newSpace["workspaceName"])
                user["workspaces"] = workspaces
                uploadData(user, "users"); //update the user data with the new workspace to MongoDB
                uploadData(newSpace, "workspaces"); //upload the workspaces data to MongoDB
                cl.outro("Creation complete!")
                setTimeout(2000)
                break;
            case "openWork":
                await workspaceOpen()
                break;
            case "signOut":
                reset()
                return "OK"
        }
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
