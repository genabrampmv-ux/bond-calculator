const ISS = "https://iss.moex.com/iss";

async function request(url) {

    console.log("MOEX URL:", url);

    const response = await fetch(url);

    console.log("STATUS:", response.status);

    if (!response.ok) {

        throw new Error(
            "Ошибка MOEX: " + response.status
        );

    }

    return await response.json();

}
    

export async function searchBond(query) {

    const url =
        `${ISS}/securities.json?q=${encodeURIComponent(query)}&iss.meta=off`;

    const data =
        await request(url);

    if (
        !data.securities ||
        data.securities.data.length === 0
    ) {

        throw new Error(
            "Облигация не найдена"
        );

    }

    const columns =
        data.securities.columns;

    const row =
        data.securities.data[0];

    const security = {};

    columns.forEach(

        (name, index) => {

            security[name] =
                row[index];

        }

    );

    return security;

}