module.exports = {
    writeFiles
};

function writeFiles() {
    this.copy('routes.tsx', 'src/main/webapp/app/routes.tsx');
}

	