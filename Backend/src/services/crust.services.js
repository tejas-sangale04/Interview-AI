const axios = require("axios");

const client = axios.create({
    baseURL: "https://crustapi.com/v1",
    headers: {
        "x-api-key": process.env.CRUST_API_KEY
    }
});

async function searchJobs({
    keywords,
    location = "",
    page = 1
}) {

    try {

        const response = await client.get("/linkedin", {
            params: {
                type: "jobs",
                keywords,
                location,
                page
            }
        });

        //console.log("Crust API Sample Job:", JSON.stringify(response.data.jobs?.[0], null, 2));

        return response.data;

    } catch (err) {

        console.error(
            "Crust Error:",
            err.response?.data || err.message
        );

        throw err;
    }
}

module.exports = {
    searchJobs
};