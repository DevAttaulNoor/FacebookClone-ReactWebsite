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
// const getActiveRoute = (route, currentPath, params = {}) => {
//     const mainPath = generatePath(route, params);
//     const altPath = route.alternativePath ? generatePath({ ...route, path: route.alternativePath }, params) : null;

//     // Exact match for base profile path
//     if (route.path === Routes.PROFILE.path) {
//         return currentPath === mainPath || currentPath === mainPath + '/' || (altPath && (currentPath === altPath || currentPath === altPath + '/'));
//     }

//     // For other routes, check if current path starts with the route path
//     return currentPath.startsWith(mainPath) || (altPath && currentPath.startsWith(altPath));
// };

const getActiveRoute = (route, currentPath, params = {}) => {
    const mainPath = generatePath(route, params);
    const altPath = route.alternativePath
        ? generatePath({ ...route, path: route.alternativePath }, params)
        : null;

    // Normalize paths by removing trailing slashes
    const normalize = path => path.replace(/\/+$/, '');
    const current = normalize(currentPath);
    const main = normalize(mainPath);
    const alt = altPath ? normalize(altPath) : null;

    // Split paths into segments for precise comparison
    const currentSegments = current.split('/');
    const mainSegments = main.split('/');
    const altSegments = alt ? alt.split('/') : [];

    // Check if current path matches main path exactly
    const isMainMatch = currentSegments.length === mainSegments.length &&
        currentSegments.every((seg, i) =>
            seg === mainSegments[i] ||
            mainSegments[i].startsWith(':'));

    // Check if current path matches alternative path exactly
    const isAltMatch = alt &&
        currentSegments.length === altSegments.length &&
        currentSegments.every((seg, i) =>
            seg === altSegments[i] ||
            altSegments[i].startsWith(':'));

    // Special case for profile route to include optional trailing slash
    if (route.path === Routes.PROFILE.path) {
        return isMainMatch || current === main + '/' ||
            (alt && (isAltMatch || current === alt + '/'));
    }

    // For all other routes, require exact segment match
    return isMainMatch || isAltMatch;
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