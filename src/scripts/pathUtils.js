// Common utilities for path filtering and manipulation

function getPathSetName(pathSet) {
    // Check if pathSet is an object with a label property
    if (pathSet.label) {
        return pathSet.label;
    }
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
    getPathSetName,
    matchesPathPattern,
    filterPathSets
};
