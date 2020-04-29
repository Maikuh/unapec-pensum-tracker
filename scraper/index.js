const axios = require("axios").default;
const cheerio = require("cheerio");
const fs = require("fs-extra");
const pensumPages = require("./pensum-pages");

const pensums = [];

async function start() {
    for (const page of pensumPages) {
        // Prep
        const res = await axios.get(page);
        const $ = cheerio.load(res.data);

        // Items
        const cuatrimestres = $("h2.nivel");

        let pensumCode = $('.cabPensum p:contains("Código Pensum")')
            .text()
            .trim();

        pensumCode = pensumCode
            .slice(0, pensumCode.indexOf(","))
            .replace(/\r?\n|\r/g, "")
            .replace(/\s+/g, " ").split(" ")[2];

        const pensum = {
            carreerName: $(".cabPensum > h1 > span").text().trim(),
            totalCredits: parseInt(
                $(".infoCarrera > p.bullet")
                    .first()
                    .text()
                    .trim()
                    .split(":")[1]
                    .trim()
            ),
            pensumCode,
            cuatris: [],
        };

        cuatrimestres.each((i, e) => {
            const currentCuatriData = {
                period: i + 1,
                subjects: [],
            };

            // Get the table element that is a next (sibling) of the cuatrimestre element
            const table = $(e).next("table");

            // Loop through the rows
            table.find("tr").each((tri, tr) => {
                const row = {
                    code: "",
                    name: "",
                    credits: 0,
                    prerequisites: "",
                };

                // The first row is the header row, which we won't use
                if (tri === 0) return;

                // Loop through the cells
                $(tr)
                    .find("td")
                    .each((tdi, td) => {
                        const tdValue = $(td).text().trim() || null;

                        // Assign the correct value based on the cell's index
                        switch (tdi) {
                            case 0:
                                row.code = tdValue;
                                break;
                            case 1:
                                row.name = tdValue;
                                break;
                            case 2:
                                row.credits = parseInt(tdValue);
                                break;
                            case 3:
                                // Get the element's text, trim it, replace all new lines/line breaks with a comma
                                // replace multiple spaces (more than one consecutive space) with a single,
                                // split by commas, filter elements that are empty, and trim each element
                                row.prerequisites =
                                    $(td)
                                        .text()
                                        .trim()
                                        .replace(/\r?\n|\r/g, ",")
                                        .replace(/\s+/g, " ")
                                        .split(",").filter(pr => pr.trim().length >= 6).map(pr => pr.trim()) || null
                                break;
                            default:
                                break;
                        }
                    });

                currentCuatriData.subjects.push(row);
            });

            pensum.cuatris.push(currentCuatriData);
        });

        pensums.push(pensum);
    }

    await writeJson();
}

async function writeJson() {
    try {
        await fs.writeJSON("./pensums.json", pensums, { spaces: 2 });
        console.log("Done!");
    } catch (error) {
        console.error(error);
    }
}

start();
