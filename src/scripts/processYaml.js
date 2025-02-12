window.yamlProcessor = {
    processYaml(yamlContent) {
        const yamlData = jsyaml.load(yamlContent);
        window.yamlData = yamlData;
        window.dispatchEvent(new CustomEvent('yamlDataUpdated', { detail: yamlData }));
        return yamlData;
    },

    loadDefaultYaml() {
        if (!window.defaultYaml) {
            console.error('Default YAML not found');
            return;
        }
        return this.processYaml(window.defaultYaml);
    },

    handleFileUpload(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = this.processYaml(e.target.result);
                    resolve(data);
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = reject;
            reader.readAsText(file);
        });
    }
};

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    const yamlInput = document.getElementById('yamlInput');

    yamlInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        window.yamlProcessor.handleFileUpload(file).catch((error) => {
            console.error('Error processing uploaded YAML file:', error);
            alert('Failed to process uploaded YAML file.');
        });
    });

    // Drag and drop functionality
    document.addEventListener('dragover', (event) => {
        event.preventDefault();
    });

    document.addEventListener('drop', (event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        if (file && (file.name.endsWith('.yaml') || file.name.endsWith('.yml'))) {
            window.yamlProcessor.handleFileUpload(file).catch((error) => {
                console.error('Error processing dropped YAML file:', error);
                alert('Failed to process dropped YAML file.');
            });
        } else {
            alert('Invalid file type. Please drop a YAML file.');
        }
    });

    // Initialize drawing state
    if (!window.drawingState) {
        window.drawingState = {
            currentPath: [],
            scale: 1,
            isDragging: false,
            dragIndex: -1,
            isDrawing: false,
            paths: []
        };
    }

    window.yamlProcessor.loadDefaultYaml();
});
