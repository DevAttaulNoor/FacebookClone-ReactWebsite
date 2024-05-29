const timeAgo = (timestamp) => {
    const currentDate = new Date();
    const postDate = new Date(timestamp * 1000);
    const seconds = Math.floor((currentDate - postDate) / 1000);
    const secondsDifference = Math.max(seconds, 1);
    const periods = {
        decade: 315360000,
        year: 31536000,
        month: 2628000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60,
        second: 1,
    };

    let elapsed = 0;
    let granularity = 0;
    let unit = '';

    for (const period in periods) {
        elapsed = Math.floor(secondsDifference / periods[period]);

        if (elapsed >= 1) {
            granularity = elapsed;
            unit = period;
            break;
        }
    }
    return `${granularity} ${unit}${granularity > 1 ? 's' : ''} ago`;
};

const timeAgoInitials = (timestamp) => {
    const currentDate = new Date();
    const postDate = new Date(timestamp * 1000);
    const seconds = Math.floor((currentDate - postDate) / 1000);
    const secondsDifference = Math.max(seconds, 1);
    const periods = {
        D: 315360000,
        Y: 31536000,
        M: 2628000,
        w: 604800,
        d: 86400,
        h: 3600,
        m: 60,
        s: 1,
    };

    let elapsed = 0;
    let granularity = 0;
    let unit = '';

    for (const period in periods) {
        elapsed = Math.floor(secondsDifference / periods[period]);

        if (elapsed >= 1) {
            granularity = elapsed;
            unit = period;
            break;
        }
    }
    return `${granularity}${unit}`;
};

const formatJoinedDate = (timestamp) => {
    // if (!timestamp || !timestamp.toDate) {
    //     return "Unknown Date";
    // }
    const dob = new Date(timestamp * 1000);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return dob.toLocaleDateString('en-GB', options);
};

export { timeAgo, timeAgoInitials, formatJoinedDate };