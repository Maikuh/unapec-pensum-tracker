import axios, { AxiosResponse } from "axios";
import cheerio from "cheerio";
import fs from "fs-extra";
import pensumPages from "./pensum-pages";

import { Pensum, Cuatri, Subject } from "./pensums.interface";

const pensums: Pensum[] = [];
const outputFile = "../client/src/pensums.json";

async function start() {
    console.log("Scraping pages...");

    for (const page of pensumPages) {
        // Prep
        let res: AxiosResponse | undefined;

        try {
            res = await axios.get(page);
        } catch (error) {
            console.error(error);
        }

        if (!res) throw new Error("Didn't get any response");

        const $ = cheerio.load(res.data);

        // Items
        const cuatrimestreElements = $("h2.nivel");

        let codeAndDateString = $('.cabPensum p:contains("Código Pensum")')
            .text()
            .trim();

        if (!codeAndDateString) return;

        let pensumCode = codeAndDateString
            .split(",")[0]
            .trim()
            .replace(/\r?\n|\r/g, "")
            .replace(/\s+/g, " ")
            .split(" ")[2];

        const dateSplitted = codeAndDateString
            .split(",")[1]
            .trim()
            .split(" ")
            .pop()!
            .split("/")
            .map((num: string) => Number(num));

        const fixedISODate = new Date(
            dateSplitted[2],
            dateSplitted[1] - 1,
            dateSplitted[0]
        ).toISOString();

        const pensum: Pensum = {
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
            date: fixedISODate,
            cuatris: [],
        };

        cuatrimestreElements.each((i, e) => {
            const currentCuatriData: Cuatri = {
                period: i + 1,
                subjects: [],
            };

            // Get the table element that is a next (sibling) of the cuatrimestre element
            const table = $(e).next("table");

            // Loop through the rows
            table.find("tr").each((tri, tr) => {
                const row: Subject = {
                    code: "",
                    name: "",
                    credits: 0,
                    prerequisites: [],
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
                                row.code = tdValue!;
                                break;
                            case 1:
                                row.name = tdValue!;
                                break;
                            case 2:
                                row.credits = parseInt(tdValue!);
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
                                        .split(",")
                                        .filter(
                                            (pr: string) =>
                                                pr.trim().length >= 6
                                        )
                                        .map((pr: string) => pr.trim()) || null;
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
        await fs.writeJSON(outputFile, pensums);
        console.log("Done!");
    } catch (error) {
        console.error(error);
    }
}

start();
