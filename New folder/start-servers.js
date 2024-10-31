const concurrently = require('concurrently');
const path = require('path');

// Define colors for different processes
const colors = {
    frontend: 'bgBlue.bold',
    mlserver: 'bgMagenta.bold',
};

// Run the commands
concurrently([
    {
        command: 'npm start',
        name: 'frontend',
        prefixColor: colors.frontend,
        cwd: path.resolve(__dirname)
    },
    {
        command: 'python ml_server/app.py',
        name: 'mlserver',
        prefixColor: colors.mlserver,
        cwd: path.resolve(__dirname)
    }
], {
    prefix: 'name',
    killOthers: ['failure', 'success'],
    restartTries: 3,
}); 