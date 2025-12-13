const bcrypt = require('bcryptjs');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('--- Password Hash Generator ---');
console.log('This script generates a bcrypt hash compatible with the new login system.');

rl.question('Enter the username (e.g., admin): ', (username) => {
    rl.question('Enter the new password: ', (password) => {

        if (!password) {
            console.error('Password cannot be empty.');
            process.exit(1);
        }

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        console.log('\n----------------------------------------');
        console.log('SUCCESS! Here are your credentials details:');
        console.log(`Username: ${username}`);
        console.log(`Password: ${password}`);
        console.log(`Hash:     ${hash}`);
        console.log('----------------------------------------');
        console.log('\nRun this SQL command in your database to update the user:');
        console.log(`UPDATE users SET pass = '${hash}' WHERE name = '${username}';`);
        console.log('\n----------------------------------------');

        rl.close();
    });
});
