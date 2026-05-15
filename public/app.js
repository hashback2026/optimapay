async function sendBulk() {

    const amount = document.getElementById("amount").value;
    const reference = document.getElementById("reference").value;
    const description = document.getElementById("description").value;

    const numbers = document
        .getElementById("numbers")
        .value
        .split("\n")
        .filter(n => n.trim() !== "");

    const output = document.getElementById("output");

    output.textContent = "Sending requests...";

    try {

        const response = await fetch("/send-bulk", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                phones: numbers,
                amount,
                reference,
                description
            })
        });

        const data = await response.json();

        output.textContent = JSON.stringify(data, null, 2);

    } catch (error) {

        output.textContent = error.message;

    }
}