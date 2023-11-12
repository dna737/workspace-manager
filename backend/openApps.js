const { exec } = require('child_process');

async function openApp(filepaths) {
    for (const path of filepaths) {
        exec(path, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error launching application: ${error}`);
                return;
            }
        });
    }
}

openApp(["C:/Users/gaume/Desktop/test1.txt","C:/Users/gaume/Desktop/test2.txt"]);