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
    },

    generateYaml(pathSets) {
        const yamlContent = pathSets.map(pathSet => {
            const yaml = pathSet.reduce((acc, pathObj) => {
                acc[pathObj.label] = {
                    Coords: pathObj.path.map(coord => [Number(coord.x.toFixed(2)), Number(coord.y.toFixed(2))])
                };
                return acc;
            }, {});
            const topLevelKey = pathSet.map(pathObj => pathObj.label).join('');
            return { [topLevelKey]: yaml };
        });

        return jsyaml.dump(yamlContent, { indent: 2 });
    },

    loadYamlFromFile(url) {
        return fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.status}`);
                }
                return response.text();
            })
            .then(text => this.processYaml(text))
            .catch(error => {
                console.error('Error loading YAML from file:', error);
                return null;
            });
    }
};

// Initialize drag and drop functionality
document.addEventListener('DOMContentLoaded', () => {
    // Initialize YAML file input
    const yamlInput = document.getElementById('yamlInput');
    if (yamlInput) {
        yamlInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            window.yamlProcessor.handleFileUpload(file).catch((error) => {
                console.error('Error processing uploaded YAML file:', error);
                alert('Failed to process uploaded YAML file.');
            });
        });
    }

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

    // Load default YAML data
    window.yamlProcessor.loadDefaultYaml();
});
