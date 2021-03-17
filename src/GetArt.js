import aicDump from './allArtworks.json';

// pull random image data from the MET 
export function getRandomArtList() {

    // make the api call
    // these are promises
    const apiCalls = [
        getListFromAIC(),
        getListFromMET()
    ];

    // resolve promises and return results
    return Promise.all(apiCalls).then((v) => {
        console.log(v);
        return v.reduce((acc, curr) => { return acc.concat(curr)}, []);
    });
}


// get list from the AIC archive
function getListFromAIC() {
    const workNumbers = 24;
    let idArray = [...Array(workNumbers)];
    
    let promArr = idArray.reduce((acc, curr) => {
        const i = Math.floor(Math.random() * (aicDump.length-1));
        const workId = aicDump[i].id;
        const workURL = `https://api.artic.edu/api/v1/artworks/${workId}`;

        acc.push( fetch(workURL).then(r => r.json()).catch((e) => {console.log(e); return undefined}) );
        return acc;
    }, []);


    return Promise.all(promArr).then((v) => {
        v.forEach((r) => {
            if (r.status && r.status === 404)
                return undefined;

            const getData = (data) => data ? data : 'Unknown';

            console.log(r);
            r.data['file_name'] = `https://www.artic.edu/iiif/2/${r.data.image_id}/full/843,/0/default.jpg`;
            r.data['date'] = r.data['date_display'] ? r.data['date_display'] : 'Unknown';
            r.data['artist'] = r.data['artist_title'] ? r.data['artist_title'] : 'Unknown';
            r.data['classification'] = getData(r.data['medium_display']);
        });

        return v.map(x => x.data).filter(x => x !== undefined).filter(x => x.image_id !== null);
    });
}

// get list from MET archice
function getListFromMET() {

    let url = 'https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&q=painting';

    // first get all matching ids
    return fetch(url)
        .then(r => r.json())
        .then(async (r) => {
        const total = r.total;
        const numberWorks = 20;
        let workPromises = [...Array(numberWorks)];

        // simple function to create art URL
        let createURL = (objectId) => `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectId}`;

        // create promises for each work
        workPromises.forEach((v, i) => {
            let id = Math.floor(Math.random() * (total-1));
            workPromises[i] = fetch(createURL(r.objectIDs[id])).then(r => r.json());
        });

        console.log(workPromises);

        // resolve all promises and return the list of works
        return Promise.all(workPromises).then((vals) => {
            vals.forEach((r) => {
                // add relevant data
                r['date'] = (r.artistDisplayName) !== '' ? r.objectDate : 'Unknown';
                r['file_name'] = r.primaryImage;
                r['artist'] = (r.artistDisplayName) !== '' ? r.artistDisplayName : 'Unknown';
                r['comments'] = (r.medium) !== '' ? r.medium : 'N/A';
            });

            return vals;
        });
    });
}