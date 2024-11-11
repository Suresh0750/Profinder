export async function getWorkerData(getComplete: any[], getTopWorker: any[]) {
    let mergeData: any[] = [];

    getTopWorker?.forEach((val) => {
        getComplete?.forEach((completed) => {
            if (String(val?._id) == String(completed?._id)) {
                // console.log(val)
                mergeData.push({ ...val, ...completed });
            }
        });
    });

    const processedData = mergeData.map((data) => {
        return {
            _id: data?._id,
            name: data?.workerDetails?.FirstName,
            trade: data?.workerDetails?.Category,
            rating: (data?.totalRating / data?.reviewCount).toFixed(2),
            jobs: data?.count,
            earnings: data?.earning
        };
    });

    console.log('Processed Data:', JSON.stringify(processedData));

    return processedData;
}

