const searchForm = document.getElementById("searchForm");

if (searchForm) {
    searchForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const query = document.getElementById("searchInput").value;
        if (!query) return alert("Please enter a search query");

        try {
            const res = await fetch("http://localhost:5000/api/services/find", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query })
            });

            if (!res.ok) throw new Error("Dataset fetch failed");

            const data = await res.json();
            const datasetResults = data.dataset || [];

            const aiRes = await fetch("http://localhost:5000/api/services/ai", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    query: query,
                    results: datasetResults
                })
            });

            if (!aiRes.ok) throw new Error("AI fetch failed");

            const aiData = await aiRes.json();

            localStorage.setItem("datasetResults", JSON.stringify(datasetResults));
            localStorage.setItem("aiResult", aiData.aiResponse);
            localStorage.setItem("query", query);   // ✅ THIS WAS MISSING

           

            window.location.href = "results.html";

        } catch (err) {
            console.error(err);
            alert("Failed to fetch results.");
        }
    });
}
