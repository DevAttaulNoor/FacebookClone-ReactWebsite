import { Routes } from "@constants/Routes";

// Helper function to generate path with params
const generatePath = (route, params = {}) => {
    let path = route.path;
    for (const [key, value] of Object.entries(params)) {
        path = path.replace(`:${key}`, value);
    }
    return path;
};

// Helper function to check if current path matches a route
const getActiveRoute = (route, currentPath, params = {}) => {
    const mainPath = generatePath(route, params);
    const altPath = route.alternativePath ? generatePath({ ...route, path: route.alternativePath }, params) : null;

    // Exact match for base profile path
    if (route.path === Routes.PROFILE.path) {
        return currentPath === mainPath || currentPath === mainPath + '/' || (altPath && (currentPath === altPath || currentPath === altPath + '/'));
    }

    // For other routes, check if current path starts with the route path
    return currentPath.startsWith(mainPath) || (altPath && currentPath.startsWith(altPath));
};

// Helper function to determine the appropriate path based on current context
const getPreferredPath = (route, params) => {
    // Always use the main path for the base profile route
    if (route.path === Routes.PROFILE.path) {
        return generatePath(route, params);
    }

    // For other routes, check if we're in the friends context
    const isFriendContext = location.pathname.includes('/friend/friendlist/');
    return isFriendContext && route.alternativePath ? generatePath({ ...route, path: route.alternativePath }, params) : generatePath(route, params);
};

export { generatePath, getActiveRoute, getPreferredPath };