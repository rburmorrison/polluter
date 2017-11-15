const $ = require('jquery');
const {ipcRenderer} = require('electron');
const {dialog} = require('electron').remote;
const fs = require('fs');

new Vue({
    el: '#root',
    mounted() {
        // Elements
        const dropZone = $('.drop-zone');

        // Listen to IPC
        ipcRenderer.on('window:hide', () => {
            this.files = [];
        });

        // Handle drop events
        document.addEventListener('dragover', (event) => {
            event.preventDefault();
            return false;
        });

        dropZone.on('dragenter', (event) => {
            event.preventDefault();
            if (this.files.length === 0)
                dropZone.addClass('drop-zone--selected');
        });

        dropZone.on('dragleave', (event) => {
            event.preventDefault();
            dropZone.removeClass('drop-zone--selected');
        });

        dropZone.on('drop', (event) => {
            event.preventDefault();
            dropZone.removeClass('drop-zone--selected');

            for (let f of event.originalEvent.dataTransfer.files) {
                const extension = f.path.substring(f.path.lastIndexOf('.'));

                if (extension === '.txt' && !this.files.includes(f.path))
                    this.files.push(f.path);
            }
        });

        document.addEventListener('drop', (event) => {
            event.preventDefault();
        });
    },
    data: {
        files: []
    },
    methods: {
        clearFiles() {
            this.files = [];
        },
        polluteFiles() {
            let dir = dialog.showOpenDialog({
                buttonLabel: 'Save File(s)',
                properties: ['openDirectory', 'createDirectory']
            });

            if (!!dir) {
                dir = dir[0];
                this.files.forEach((file) => {
                    fs.readFile(file, 'utf-8', (err, data) => {
                        let newData = data.replace(/\r?\n|\r/g, '\r\n');
                        const newFilePath = dir + file.substring(file.lastIndexOf('/'));

                        fs.writeFile(newFilePath, newData, (err) => {
                            this.files.splice(file).join();
                        });
                    });
                });
            }
        },
        onClose() {
            ipcRenderer.send('window:close');
        }
    }
});