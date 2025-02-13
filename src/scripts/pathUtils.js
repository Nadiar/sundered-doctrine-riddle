// Common utilities for path filtering and manipulation

function getPathSetName(pathSet) {
    // Check if pathSet is an array of path objects
    if (Array.isArray(pathSet)) {
        return pathSet.map(pathObj => pathObj.label).join('');
    }
    // Handle YAML data structure
    const setName = Object.keys(pathSet)[0];
    if (setName) {
        return setName;
    }
    return '';
}

function matchesPathPattern(pathSetName, filters) {
    if (!pathSetName) return false;
    // If all filters are empty, return true to include all path sets
    if (filters.every(filter => !filter)) return true;
    return filters.every((filter, index) => {
        if (!filter) return true;
        const pathLabel = pathSetName.substring(index * 2, (index * 2) + 2);
        return pathLabel.toLowerCase() === filter.toLowerCase();
    });
}

function filterPathSets(pathSets, filters) {
    if (!Array.isArray(pathSets)) return [];
    filters = filters.map(f => f?.toLowerCase() || '');
    
    return pathSets.filter(pathSet => {
        if (!pathSet) return false;
        const pathSetName = getPathSetName(pathSet);
        return matchesPathPattern(pathSetName, filters);
    });
}

// Export the utilities
window.pathUtils = {
    getPathSetName(pathSet) {
        if (!pathSet) return '';
        
        // Handle array format
        if (Array.isArray(pathSet)) {
            return pathSet.map(pathObj => pathObj.label).join('');
        }
        
        // Handle object format
        const setName = Object.keys(pathSet)[0];
        return setName || '';
    },

    matchesPathPattern(pathSetName, filters) {
        console.log('Matching:', { pathSetName, filters });
        if (!pathSetName) return false;
    
        // If all filters are empty, return true to include all path sets
        if (filters.every(filter => !filter)) return true;

        const setName = pathSetName.toUpperCase(); // Convert to uppercase for comparison
        return filters.every((filter, index) => {
            if (!filter) return true;
            const pathLabel = setName.substring(index * 2, (index * 2) + 2);
            console.log('Comparing:', { pathLabel, filter });
            return pathLabel === filter.toUpperCase(); // Compare uppercase values
        });
    },

    filterPathSets(pathSets, filters) {
        console.log('Filtering paths:', { pathSets, filters });
        if (!Array.isArray(pathSets)) {
            console.error('pathSets is not an array:', pathSets);
            return [];
        }

        const filteredPaths = pathSets.filter(pathSet => {
            const pathSetName = this.getPathSetName(pathSet);
            const matches = this.matchesPathPattern(pathSetName, filters);
            console.log('Path set:', { pathSetName, matches });
            return matches;
        });

        console.log('Filtered result:', filteredPaths);
        return filteredPaths;
    }
};
